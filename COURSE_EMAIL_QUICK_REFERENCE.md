# Course Email System - Quick Reference

## 🚀 Deployment Steps

### 1. Generate CRON_SECRET
```bash
# Generate a random secret (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Add to Vercel
```
Vercel Dashboard → Settings → Environment Variables
Name: CRON_SECRET
Value: [your-generated-secret]
Environments: Production, Preview, Development
```

### 3. Deploy
```bash
git add .
git commit -m "feat: implement course email system"
git push origin master
```

### 4. Verify Cron Job
- Go to Vercel Dashboard → Project → Cron Jobs
- Verify `/api/cron/send-course-emails` is listed
- Check schedule: `0 9 * * *` (9 AM UTC daily)

## 📝 Testing

### Test Subscribe (Local)
```bash
curl -X POST http://localhost:3000/api/subscribe-course \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test@email.com",
    "name": "Test User"
  }'
```

### Test Subscribe (Production)
```bash
curl -X POST https://your-domain.com/api/subscribe-course \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test@email.com",
    "name": "Test User"
  }'
```

### Test Cron Job
```bash
curl -X GET https://your-domain.com/api/cron/send-course-emails \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"
```

### Test Unsubscribe
```bash
curl -X POST https://your-domain.com/api/unsubscribe-course \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test@email.com"}'
```

## 📊 Database Queries

### Check All Subscribers
```sql
SELECT 
  email, 
  name, 
  status, 
  "emailsSent", 
  "createdAt"
FROM course_subscribers 
ORDER BY "createdAt" DESC;
```

### Count by Status
```sql
SELECT status, COUNT(*) as count
FROM course_subscribers
GROUP BY status;
```

### Find Who Needs Email Today
```sql
SELECT 
  email,
  name,
  "emailsSent",
  EXTRACT(day FROM (NOW() - "createdAt")) as days_since_signup
FROM course_subscribers
WHERE status = 'ACTIVE';
```

### Recent Completions
```sql
SELECT email, "completedAt"
FROM course_subscribers
WHERE status = 'COMPLETED'
ORDER BY "completedAt" DESC
LIMIT 10;
```

## 🔍 Monitoring

### Check Cron Logs (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs"
4. Filter by `/api/cron/send-course-emails`

### Key Log Patterns
```
✅ Success: "Course email cron completed"
📧 Sending: "Sending day X to user@example.com"  
❌ Error: "Failed to send day X"
🎉 Complete: "Subscriber completed the course"
```

## ⚡ Quick Commands

### Start Dev Server
```bash
npm run dev
```

### Build Project
```bash
npm run build
```

### Run Prisma Studio
```bash
npx prisma studio
```

### Check Database Schema
```bash
npx prisma db pull
```

### Generate Prisma Client
```bash
npx prisma generate
```

## 🐛 Troubleshooting

### Emails Not Sending
1. Check email credentials in .env
2. Verify CRON_SECRET matches
3. Check Vercel cron logs
4. Test email service manually

### Cron Not Running
1. Verify CRON_SECRET in Vercel
2. Check vercel.json syntax
3. Redeploy project
4. Check Vercel cron dashboard

### Duplicate Emails
1. Check emailsSent array
2. Verify cron runs only once
3. Check database constraints

## 📞 Emergency Commands

### Stop All Emails
```sql
UPDATE course_subscribers 
SET status = 'UNSUBSCRIBED' 
WHERE status = 'ACTIVE';
```

### Re-enable Single User
```sql
UPDATE course_subscribers 
SET status = 'ACTIVE', 
    "unsubscribedAt" = NULL 
WHERE email = 'user@example.com';
```

### Reset User's Progress
```sql
UPDATE course_subscribers 
SET "emailsSent" = ARRAY[1], 
    status = 'ACTIVE' 
WHERE email = 'user@example.com';
```

## 📈 Analytics Queries

### Completion Rate
```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'COMPLETED') * 100.0 / 
  COUNT(*) FILTER (WHERE status IN ('ACTIVE', 'COMPLETED')) as completion_rate
FROM course_subscribers;
```

### Unsubscribe Rate
```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'UNSUBSCRIBED') * 100.0 / 
  COUNT(*) as unsubscribe_rate
FROM course_subscribers;
```

### Daily Signups (Last 7 Days)
```sql
SELECT 
  DATE("createdAt") as signup_date,
  COUNT(*) as signups
FROM course_subscribers
WHERE "createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY DATE("createdAt")
ORDER BY signup_date DESC;
```

## 🔐 Security Checklist

- [ ] CRON_SECRET generated and added to Vercel
- [ ] Email credentials secured in environment variables
- [ ] API endpoints tested
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Rate limiting considered (future)

## 📚 Documentation Files

- `COURSE_EMAIL_SYSTEM.md` - Full documentation
- `COURSE_EMAIL_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `COURSE_EMAIL_QUICK_REFERENCE.md` - This file
- `.env.example` - Environment variables template

## 🎯 Success Checklist

Day 1:
- [ ] Deploy to Vercel
- [ ] Add CRON_SECRET
- [ ] Test subscribe endpoint
- [ ] Verify Day 1 email sends

Day 2:
- [ ] Check cron executed
- [ ] Verify Day 2 email sent
- [ ] Monitor logs

Week 1:
- [ ] Track completion rate
- [ ] Monitor error logs
- [ ] Gather user feedback

## 💡 Tips

- Test with your own email first
- Monitor the first few cron runs closely
- Check spam folder if emails missing
- Keep an eye on Vercel usage/costs
- Set up alerts for failed cron jobs

## 🚨 When Things Go Wrong

1. **Check Logs First**
   - Vercel deployment logs
   - Vercel cron logs
   - Database logs

2. **Verify Configuration**
   - Environment variables
   - Vercel cron dashboard
   - Database connection

3. **Test Manually**
   - Call API endpoints directly
   - Check database state
   - Verify email service

4. **Rollback if Needed**
   - Previous deployment still works
   - Can disable cron in Vercel
   - Can pause subscriptions via database

---

**Ready to launch! 🚀**

For detailed documentation, see `COURSE_EMAIL_SYSTEM.md`
