#!/bin/bash

# Simple monitoring script for Vibed to Cracked
# Add to crontab: */5 * * * * /path/to/monitor.sh

LOG_FILE="/var/log/vibed-to-cracked-monitor.log"
DOMAIN=$(grep "NEXTAUTH_URL" .env.production | cut -d'=' -f2)
EMAIL="your-admin-email@example.com"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Function to send alert (requires mail command)
send_alert() {
    local subject="$1"
    local message="$2"
    echo "$message" | mail -s "$subject" $EMAIL 2>/dev/null || echo "Alert: $subject - $message" >> $LOG_FILE
}

# Check if Docker containers are running
check_containers() {
    local containers=("vibed-to-cracked-app" "vibed-to-cracked-db" "vibed-to-cracked-nginx")
    
    for container in "${containers[@]}"; do
        if ! docker ps --format "table {{.Names}}" | grep -q "^$container$"; then
            log_message "ERROR: Container $container is not running"
            send_alert "Container Down" "Container $container is not running on $(hostname)"
            
            # Try to restart the container
            docker-compose restart $container
            if [ $? -eq 0 ]; then
                log_message "INFO: Successfully restarted $container"
            else
                log_message "ERROR: Failed to restart $container"
            fi
        fi
    done
}

# Check application health
check_app_health() {
    local health_url="$DOMAIN/api/health"
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" $health_url --max-time 10)
    
    if [ "$response_code" != "200" ]; then
        log_message "ERROR: Application health check failed (HTTP $response_code)"
        send_alert "App Health Check Failed" "Application returned HTTP $response_code for $health_url"
    else
        log_message "INFO: Application health check passed"
    fi
}

# Check SSL certificate expiry
check_ssl_cert() {
    local domain_name=$(echo $DOMAIN | sed 's/https:\/\///')
    local expiry_date=$(docker-compose exec -T certbot openssl x509 -in /etc/letsencrypt/live/$domain_name/cert.pem -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -n "$expiry_date" ]; then
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ $days_until_expiry -lt 30 ]; then
            log_message "WARNING: SSL certificate expires in $days_until_expiry days"
            send_alert "SSL Certificate Expiring" "SSL certificate for $domain_name expires in $days_until_expiry days"
        fi
    fi
}

# Check disk space
check_disk_space() {
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $disk_usage -gt 85 ]; then
        log_message "WARNING: Disk usage is at $disk_usage%"
        send_alert "High Disk Usage" "Disk usage is at $disk_usage% on $(hostname)"
    fi
}

# Check database connectivity
check_database() {
    if ! docker-compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
        log_message "ERROR: Database is not responding"
        send_alert "Database Down" "PostgreSQL database is not responding on $(hostname)"
    else
        log_message "INFO: Database connectivity check passed"
    fi
}

# Main monitoring function
main() {
    log_message "Starting monitoring check"
    
    check_containers
    check_app_health
    check_ssl_cert
    check_disk_space
    check_database
    
    log_message "Monitoring check completed"
}

# Run main function
main
