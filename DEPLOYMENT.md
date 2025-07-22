# Vibed to Cracked - Docker Deployment Guide

This guide will help you deploy your Vibed to Cracked application to a VPS with Docker, complete with HTTPS support via Let's Encrypt.

## Prerequisites

- A VPS with Ubuntu 20.04+ (2GB RAM minimum, 4GB recommended)
- A domain name pointing to your VPS IP
- SSH access to your VPS

## Quick Start

### 1. Prepare Your VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in to apply Docker group changes
```

### 2. Deploy Your Application

```bash
# Clone your repository
git clone https://github.com/yourusername/vibed-to-cracked.git
cd vibed-to-cracked/app

# Make deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The deployment script will:
- Guide you through configuration
- Set up environment variables
- Obtain SSL certificates
- Start all services
- Set up automatic certificate renewal

### 3. Configure OAuth Applications

During deployment, you'll need to set up OAuth applications:

#### GitHub OAuth App
1. Go to https://github.com/settings/applications/new
2. Set Authorization callback URL to: `https://yourdomain.com/api/auth/callback/github`

#### Google OAuth App
1. Go to https://console.developers.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set Authorized redirect URIs to: `https://yourdomain.com/api/auth/callback/google`

## Manual Configuration

If you prefer manual setup:

### 1. Environment Variables

Copy and configure the environment file:
```bash
cp .env.production.example .env.production
nano .env.production
```

### 2. Update Domain Configuration

Replace `yourdomain.com` in these files:
- `docker-compose.yml`
- `nginx/sites-available/vibed-to-cracked`

### 3. Enable Nginx Site

```bash
ln -sf ../sites-available/vibed-to-cracked nginx/sites-enabled/vibed-to-cracked
```

### 4. Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Run database migrations
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed

# Obtain SSL certificates
docker-compose run --rm certbot

# Reload nginx
docker-compose exec nginx nginx -s reload
```

## Service Architecture

- **app**: Next.js application (port 3000 internal)
- **db**: PostgreSQL database (port 5432)
- **nginx**: Reverse proxy with SSL (ports 80, 443)
- **certbot**: SSL certificate management

## Useful Commands

### Application Management
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f db

# Restart services
docker-compose restart
docker-compose restart app

# Update application
git pull
docker-compose up --build -d app

# Stop all services
docker-compose down
```

### Database Management
```bash
# Access database
docker-compose exec db psql -U postgres -d vibed_to_cracked

# Create backup
docker-compose exec db pg_dump -U postgres vibed_to_cracked > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T db psql -U postgres -d vibed_to_cracked < backup.sql

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Reset database (DANGER!)
docker-compose exec app npx prisma migrate reset --force
```

### SSL Management
```bash
# Renew certificates manually
docker-compose run --rm certbot renew

# Test certificate renewal
docker-compose run --rm certbot renew --dry-run

# View certificate info
docker-compose exec certbot certbot certificates
```

### Monitoring
```bash
# System resource usage
docker stats

# Disk usage
docker system df
docker system prune -a  # Clean up unused containers/images

# Check running containers
docker ps
```

## Security Considerations

### Firewall Setup
```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Regular Maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d

# Clean up Docker
docker system prune -a
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your domain URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `GITHUB_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_SECRET` | GitHub OAuth client secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | No |

## Troubleshooting

### Common Issues

1. **SSL certificates not working**
   ```bash
   # Check if certificates exist
   docker-compose exec certbot ls /etc/letsencrypt/live/yourdomain.com/
   
   # Re-obtain certificates
   docker-compose run --rm certbot
   docker-compose exec nginx nginx -s reload
   ```

2. **Database connection errors**
   ```bash
   # Check database status
   docker-compose exec db pg_isready -U postgres
   
   # Check database logs
   docker-compose logs db
   ```

3. **Application not starting**
   ```bash
   # Check application logs
   docker-compose logs app
   
   # Rebuild application
   docker-compose up --build -d app
   ```

4. **Domain not resolving**
   - Verify DNS settings point to your VPS IP
   - Check domain propagation: `nslookup yourdomain.com`

### Performance Optimization

1. **Enable Gzip compression** (already configured in nginx)
2. **Set up CDN** for static assets
3. **Database optimization**:
   ```bash
   # Analyze database performance
   docker-compose exec db psql -U postgres -d vibed_to_cracked -c "ANALYZE;"
   ```

## Backup Strategy

### Automated Backups
Create a backup script:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres vibed_to_cracked > "backups/db_backup_$DATE.sql"
tar -czf "backups/app_backup_$DATE.tar.gz" .env.production prisma/
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/your/app && ./backup.sh
```

## Scaling Considerations

For high traffic, consider:
- Load balancer (nginx upstream)
- Database replica for read queries
- Redis for session storage
- CDN for static assets
- Horizontal scaling with Kubernetes

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check firewall settings
4. Ensure domain DNS is properly configured

For more help, refer to the application documentation or create an issue in the repository.
