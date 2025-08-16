# Email Service Test Guide

## Quick Test Commands

### 1. Test Email Statistics
```bash
curl -X GET "http://localhost:3000/api/email/promotional" \
  -H "Content-Type: application/json"
```

### 2. Send Promotional Email
```bash
curl -X POST "http://localhost:3000/api/email/promotional" \
  -H "Content-Type: application/json" \
  -d '{
    "promotion": {
      "title": "Limited Time Offer",
      "description": "Get 50% off premium features!",
      "ctaText": "Claim Offer",
      "ctaUrl": "https://example.com/offer"
    }
  }'
```

### 3. Test Email Template
```bash
curl -X POST "http://localhost:3000/api/email/test" \
  -H "Content-Type: application/json" \
  -d '{"type": "promotional"}'
```

### 4. Test Study Reminder
```bash
curl -X POST "http://localhost:3000/api/email/study-reminder" \
  -H "Content-Type: application/json" \
  -d '{"daysInactive": 3}'
```

### 5. Get Email Preferences
```bash
curl -X GET "http://localhost:3000/api/email/preferences" \
  -H "Content-Type: application/json"
```

## Expected Responses

- **401**: Unauthorized (need to be logged in)
- **400**: Bad request (missing required fields)
- **200**: Success with email results
- **500**: Server error

## Setup Required

1. Set environment variables:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="Vibed to Cracked <noreply@vibedtocracked.com>"
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Run tests (requires authentication for most endpoints)