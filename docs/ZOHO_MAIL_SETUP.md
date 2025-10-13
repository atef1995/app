# 📧 Zoho Mail SMTP Configuration Guide

This guide will help you configure Zoho Mail as your SMTP email service for the "Vibed to Cracked" application.

## 🚀 Prerequisites

1. **Zoho Mail Account**: You need an active Zoho Mail account
2. **Domain Setup**: Optionally, a custom domain configured with Zoho Mail
3. **App Password**: Generated from Zoho Mail security settings

## 🔧 Step 1: Generate App Password

### For Zoho Mail with Custom Domain:
1. Log in to your Zoho Mail account
2. Go to **Settings** → **Security** → **App Passwords**
3. Click **Generate New Password**
4. Choose **Email** as the application type
5. Enter a name like "Vibed to Cracked App"
6. Copy the generated password (16 characters)

### For Personal Zoho Mail:
1. Log in to your Zoho account at accounts.zoho.com
2. Go to **Security** → **App Passwords**
3. Generate a new app password for email
4. Copy the generated password

## 🛠️ Step 2: Environment Configuration

Add these variables to your `.env.local` file:

```env
# Zoho Mail SMTP Configuration
SMTP_HOST="smtppro.zoho.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@yourdomain.com"
SMTP_PASS="your-16-char-app-password"
SMTP_FROM="Vibed to Cracked <your-email@yourdomain.com>"

# For OAuth authentication (optional)
NEXTAUTH_URL="http://localhost:3000"
```

### Configuration Options:

| Setting | Value | Description |
|---------|-------|-------------|
| `SMTP_HOST` | `smtppro.zoho.com` | Zoho Mail SMTP server |
| `SMTP_PORT` | `587` | STARTTLS port (recommended) |
| `SMTP_SECURE` | `false` | Use STARTTLS instead of SSL |
| `SMTP_USER` | Your Zoho email | Full email address |
| `SMTP_PASS` | App password | 16-character app password |
| `SMTP_FROM` | Display name + email | How emails appear to recipients |

## 🔐 Step 3: Security Settings

### Enable Two-Factor Authentication:
1. Go to Zoho Account Security settings
2. Enable 2FA for additional security
3. Use authenticator app or SMS

### Whitelist Your Server IP (if needed):
1. In Zoho Mail settings, go to **Security**
2. Add your server's IP address to the whitelist
3. This may be required for production deployments

## 🧪 Step 4: Test Configuration

### Using the Admin Dashboard:
1. Start your application: `npm run dev`
2. Visit `/admin` (requires admin role)
3. Go to the **Email Dashboard** tab
4. Click **Test Connection** button
5. Check the connection status

### Manual Testing:
```bash
# Test the email service directly
curl "http://localhost:3000/api/email/test-connection"
```

### Expected Response:
```json
{
  "success": true,
  "service": "Zoho Mail",
  "timestamp": "2024-01-XX...",
  "config": {
    "host": "smtppro.zoho.com",
    "port": "587",
    "secure": false,
    "user": "***configured***"
  }
}
```

## 📊 Step 5: Monitor Email System

### Admin Dashboard Features:
- ✅ **Real-time Connection Status**: See if Zoho Mail is connected
- 📈 **Email Statistics**: Track sent emails and user engagement
- 🔄 **Connection Testing**: Test SMTP connection on demand
- 📋 **Configuration Display**: View current SMTP settings (passwords hidden)

### Key Metrics Displayed:
- Total users and email subscribers
- Inactive users needing reminders
- Email engagement rates
- System health status

## 🚨 Troubleshooting

### Common Issues:

#### 1. **Authentication Failed (535 Error)**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solutions:**
- ✅ Use app password, not account password
- ✅ Ensure email address is correct
- ✅ Check if 2FA is enabled (required for app passwords)
- ✅ Verify the app password is copied correctly

#### 2. **Connection Timeout**
```
Error: connect ETIMEDOUT
```
**Solutions:**
- ✅ Check firewall settings
- ✅ Verify SMTP_HOST and SMTP_PORT
- ✅ Ensure server can reach smtppro.zoho.com:587

#### 3. **SSL/TLS Errors**
```
Error: self signed certificate in certificate chain
```
**Solutions:**
- ✅ Use `SMTP_SECURE="false"` with port 587
- ✅ Try port 465 with `SMTP_SECURE="true"` if needed
- ✅ Check server's SSL certificate validation

#### 4. **Rate Limiting**
```
Error: 421 4.7.0 Try again later
```
**Solutions:**
- ✅ Reduce email sending frequency
- ✅ Implement proper delays between emails
- ✅ Check Zoho Mail sending limits

### Debug Commands:
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.SMTP_HOST)"

# Test email service in development
npm run dev
# Then visit http://localhost:3000/api/email/test-connection
```

## 📧 Email Types Supported

### 1. **Welcome Emails**
- Sent automatically when users register
- Includes personalized mood-based content
- Links to dashboard and first steps

### 2. **Promotional Campaigns**
- Admin-controlled marketing emails
- Respects user preferences
- Includes unsubscribe links

### 3. **Study Reminders**
- Automated based on user inactivity
- Personalized with actual progress data
- Respects user-set reminder times

## 🔄 Automatic Features

### **Smart Reminder System:**
- Runs every 30 minutes via cron job
- Respects individual user reminder times
- Only emails inactive users (3+ days)
- Includes actual progress and next steps

### **User Preference Respect:**
- Users can disable email notifications
- Individual reminder time customization
- Timezone-aware scheduling
- One-click unsubscribe options

## 🎯 Production Deployment

### Environment Variables for Production:
```env
SMTP_HOST="smtppro.zoho.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="production-app-password"
SMTP_FROM="Vibed to Cracked <noreply@yourdomain.com>"
```

### Best Practices:
- ✅ Use a dedicated email address for the application
- ✅ Set up proper SPF/DKIM records for your domain
- ✅ Monitor bounce rates and delivery statistics
- ✅ Implement proper error handling and logging
- ✅ Use environment-specific configurations

## 📈 Success Metrics

Monitor these indicators for successful email delivery:

- **Connection Status**: Should show "Connected" in admin dashboard
- **Delivery Rate**: Most emails should be delivered successfully
- **User Engagement**: Track email open rates and click-through rates
- **Error Logs**: Minimal SMTP errors in application logs

## 🔗 Useful Links

- [Zoho Mail SMTP Settings](https://www.zoho.com/mail/help/zoho-smtp.html)
- [Zoho App Passwords Guide](https://www.zoho.com/mail/help/adminconsole/two-factor-authentication.html)
- [Zoho Mail API Documentation](https://www.zoho.com/mail/api/)

## 🎉 Success!

Once configured correctly, you should see:
- ✅ Green connection status in admin dashboard
- ✅ Successful welcome emails for new users
- ✅ Working study reminder system
- ✅ Functional promotional email campaigns

Your email system is now powered by Zoho Mail and ready for production use! 🚀