# Free Course Email System Documentation

## Overview
This document explains the automated 5-day JavaScript course email system implementation.

## System Architecture

### Components

1. **Database Model**: `CourseSubscriber`
2. **API Endpoints**:
   - `/api/subscribe-course` - Subscribe to the course
   - `/api/unsubscribe-course` - Unsubscribe from course emails
   - `/api/cron/send-course-emails` - Automated daily email sender (Vercel Cron)
3. **Email Service**: Integrated with existing emailService
4. **Cron Job**: Runs daily at 9 AM UTC

## Database Schema

```prisma
model CourseSubscriber {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  emailsSent      Int[]    @default([])  // Array of day numbers (1-5)
  status          String   @default("ACTIVE")  // ACTIVE, COMPLETED, UNSUBSCRIBED
  completedAt     DateTime?
  unsubscribedAt  DateTime?
  source          String?  // Where they signed up from
  ipAddress       String?  // For abuse prevention
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Email Flow

### Day 1 - Immediate
- Sent immediately when user subscribes
- Covers: Variables & Data Types
- Saved to database with `emailsSent: [1]`

### Days 2-5 - Automated
- Sent by cron job at 9 AM UTC daily
- Cron job checks:
  1. Days since signup
  2. Which emails already sent
  3. Sends next day's email if appropriate
- Emails:
  - **Day 2**: Functions & Scope
  - **Day 3**: Arrays & Objects
  - **Day 4**: DOM Manipulation
  - **Day 5**: Mini Project (Counter App)

## API Endpoints

### POST `/api/subscribe-course`

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed! Check your email for Day 1."
}
```

**Features:**
- Validates email format
- Checks for existing subscriptions
- Handles re-subscriptions (if previously unsubscribed)
- Sends Day 1 email immediately
- Tracks IP address for abuse prevention
- Records source/referrer

### POST `/api/unsubscribe-course`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from course emails."
}
```

**Features:**
- Marks subscriber as UNSUBSCRIBED
- Records unsubscribe timestamp
- Prevents future emails

### GET `/api/cron/send-course-emails`

**Headers Required:**
```
Authorization: Bearer ${CRON_SECRET}
```

**Response:**
```json
{
  "success": true,
  "message": "Course emails processed successfully",
  "stats": {
    "totalProcessed": 150,
    "emailsSent": 45,
    "errors": 2,
    "skipped": 78,
    "completed": 25
  },
  "timestamp": "2025-10-16T09:00:00.000Z"
}
```

**Logic:**
1. Verifies CRON_SECRET for security
2. Queries all ACTIVE subscribers
3. For each subscriber:
   - Calculates days since signup
   - Determines next email day (2-5)
   - Checks if already sent
   - Sends email if due
   - Updates emailsSent array
   - Marks as COMPLETED after Day 5

## Cron Schedule

Configured in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-course-emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

- **Frequency**: Daily
- **Time**: 9:00 AM UTC
- **Cron Expression**: `0 9 * * *`

## Environment Variables

Required in `.env`:
```bash
# Cron Job Security
CRON_SECRET="your-random-secret-here"

# Email Configuration (existing)
EMAIL_USER="your-email@domain.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.zoho.com"
EMAIL_PORT="465"
```

## Email Content

Each day's email includes:
- **Header**: Day badge and title
- **Content**: Educational material
- **Exercise**: Hands-on practice
- **CTA**: Link to full tutorial
- **Footer**: Unsubscribe link

**Day 5 Special Features:**
- Completion congratulations
- Premium upgrade CTA
- Course completion celebration

## Status Flow

```
[New Signup] → ACTIVE → [Day 1-5 emails] → COMPLETED
                ↓
         UNSUBSCRIBED (if user opts out)
                ↓
         ACTIVE (if user re-subscribes)
```

## Error Handling

### Subscribe Endpoint
- Invalid email format → 400 error
- Database errors → 500 error
- Email send failures → Continue (cron will retry)

### Cron Job
- Missing CRON_SECRET → 401 Unauthorized
- Email send failures → Log error, continue with other subscribers
- Database errors → 500 error with details

## Testing

### Manual Testing

1. **Subscribe Flow:**
```bash
curl -X POST http://localhost:3000/api/subscribe-course \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

2. **Trigger Cron (with auth):**
```bash
curl -X GET http://localhost:3000/api/cron/send-course-emails \
  -H "Authorization: Bearer your-cron-secret"
```

3. **Unsubscribe:**
```bash
curl -X POST http://localhost:3000/api/unsubscribe-course \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Database Queries

Check subscribers:
```sql
SELECT * FROM course_subscribers ORDER BY "createdAt" DESC;
```

Check by status:
```sql
SELECT status, COUNT(*) FROM course_subscribers GROUP BY status;
```

## Monitoring

### Logs to Watch

1. **Subscription logs:**
```
📧 New course subscriber: user@example.com
✅ Day 1 email sent to user@example.com
```

2. **Cron job logs:**
```
🕐 Running course email cron at 2025-10-16T09:00:00.000Z
📊 Found 150 active subscribers
📧 Sending day 2 to user@example.com
✅ Successfully sent day 2 to user@example.com
✅ Course email cron completed: {...}
```

### Key Metrics
- Total subscribers
- Active vs Completed vs Unsubscribed
- Email delivery success rate
- Completion rate (reached Day 5)

## Vercel Deployment

### Setup Steps

1. Add `CRON_SECRET` to Vercel environment variables
2. Deploy project
3. Verify cron job is registered in Vercel dashboard
4. Test cron endpoint manually first

### Vercel Cron Dashboard
- View execution history
- Monitor errors
- Check execution times
- View logs

## Security

1. **CRON_SECRET**: Prevents unauthorized cron execution
2. **IP Tracking**: Helps identify abuse patterns
3. **Email Validation**: Prevents invalid emails
4. **Rate Limiting**: Consider adding to subscribe endpoint
5. **Duplicate Prevention**: Checks existing subscriptions

## Future Enhancements

- [ ] Add analytics tracking
- [ ] A/B test email content
- [ ] Add course completion badges
- [ ] Send completion certificates
- [ ] Track email open rates
- [ ] Add retry logic for failed sends
- [ ] Implement rate limiting on subscribe
- [ ] Add CAPTCHA for signup
- [ ] Create admin dashboard for subscribers
- [ ] Export subscriber data

## Troubleshooting

### Emails Not Sending

1. Check email service configuration
2. Verify email credentials
3. Check logs for errors
4. Test emailService.sendFreeCourseEmail() directly

### Cron Not Running

1. Verify CRON_SECRET is set in Vercel
2. Check Vercel cron dashboard
3. Ensure schedule is correct in vercel.json
4. Test endpoint manually with auth header

### Duplicate Emails

1. Check emailsSent array in database
2. Verify cron logic
3. Check for multiple cron instances

## Support

For issues or questions:
- Check logs in Vercel dashboard
- Query database for subscriber status
- Test endpoints manually
- Review email service logs

## Maintenance

### Weekly Tasks
- Review error logs
- Check completion rates
- Monitor unsubscribe rate

### Monthly Tasks
- Analyze email performance
- Review and update content
- Check for spam complaints
- Clean up old completed subscribers (optional)

## Success Metrics

Track these KPIs:
- **Subscription Rate**: New signups per day
- **Completion Rate**: % reaching Day 5
- **Unsubscribe Rate**: % opting out
- **Email Delivery Rate**: % successfully delivered
- **Engagement**: Email opens/clicks (if tracking added)
