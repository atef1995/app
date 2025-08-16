import nodemailer from 'nodemailer';
import { User } from '@prisma/client';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtppro.zoho.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.transporter.verify();
      console.log('✅ Zoho Mail SMTP connection verified successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Zoho Mail SMTP connection failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown connection error' 
      };
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Vibed to Cracked <noreply@yourdomain.com>',
        to,
        subject,
        html,
      });
      
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send email via Zoho Mail:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown email error' 
      };
    }
  }

  async sendWelcomeEmail(user: User) {
    const subject = 'Welcome to Vibed to Cracked! 🚀';
    const html = this.generateWelcomeTemplate(user);
    
    return await this.sendEmail(user.email, subject, html);
  }

  async sendPromotionalEmail(user: User, promotion: {
    title: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
  }) {
    const subject = `${promotion.title} - Special Offer Just for You!`;
    const html = this.generatePromotionalTemplate(user, promotion);
    
    return await this.sendEmail(user.email, subject, html);
  }

  async sendStudyReminderEmail(user: User, reminderData: {
    lastActive: Date;
    streak?: number;
    nextLesson?: string;
  }) {
    const subject = `Time to get back to coding, ${user.name || user.username || 'there'}! 💪`;
    const html = this.generateStudyReminderTemplate(user, reminderData);
    
    return await this.sendEmail(user.email, subject, html);
  }

  private generateWelcomeTemplate(user: User): string {
    const moodEmojis: Record<string, string> = {
      CHILL: '😎',
      RUSH: '⚡',
      GRIND: '🔥'
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Vibed to Cracked</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .mood-badge { display: inline-block; background: #f0f0f0; padding: 8px 16px; border-radius: 20px; margin: 10px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Vibed to Cracked! 🚀</h1>
            <p>Your JavaScript learning journey starts now</p>
          </div>
          
          <div class="content">
            <h2>Hey ${user.name || user.username || 'there'}! ${moodEmojis[user.mood] || '👋'}</h2>
            
            <p>Welcome to the most mood-driven JavaScript learning platform on the web! We're excited to have you on board.</p>
            
            <div class="mood-badge">
              <strong>Your Current Mood:</strong> ${user.mood} ${moodEmojis[user.mood] || ''}
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>🎯 Complete your first tutorial</li>
              <li>💪 Take on some coding challenges</li>
              <li>🏆 Unlock your first achievement</li>
              <li>👥 Connect with other learners</li>
            </ul>
            
            <p>Remember, you can always switch your mood to match how you're feeling - whether you want to CHILL, RUSH, or GRIND!</p>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="cta-button">Start Learning Now</a>
            
            <p><small>Pro tip: Set up your study reminders in settings to maintain your coding streak! 🔥</small></p>
          </div>
          
          <div class="footer">
            <p>Happy coding!<br>The Vibed to Cracked Team</p>
            <p><a href="${process.env.NEXTAUTH_URL}/settings">Update email preferences</a></p>
          </div>
        </body>
      </html>
    `;
  }

  private generatePromotionalTemplate(user: User, promotion: {
    title: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${promotion.title}</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .cta-button { display: inline-block; background: #f5576c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${promotion.title} 🎉</h1>
            <p>Limited time offer just for you!</p>
          </div>
          
          <div class="content">
            <h2>Hey ${user.name || user.username}!</h2>
            
            <p>${promotion.description}</p>
            
            <div class="highlight">
              <strong>🎯 This offer is personalized for your ${user.mood} learning style!</strong>
            </div>
            
            <p>Don't miss out on this opportunity to level up your JavaScript skills with premium content and features.</p>
            
            <a href="${promotion.ctaUrl}" class="cta-button">${promotion.ctaText}</a>
            
            <p><small>This offer expires soon. Take action now! ⏰</small></p>
          </div>
          
          <div class="footer">
            <p>Happy coding!<br>The Vibed to Cracked Team</p>
            <p><a href="${process.env.NEXTAUTH_URL}/settings">Update email preferences</a> | <a href="${process.env.NEXTAUTH_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </body>
      </html>
    `;
  }

  private generateStudyReminderTemplate(user: User, reminderData: {
    lastActive: Date;
    streak?: number;
    nextLesson?: string;
  }): string {
    const daysSinceActive = Math.floor((Date.now() - reminderData.lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Time to Code!</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .streak-box { background: #e8f5e8; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .cta-button { display: inline-block; background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Your Code is Calling! 💻</h1>
            <p>Time to get back in the ${user.mood.toLowerCase()} zone</p>
          </div>
          
          <div class="content">
            <h2>Hey ${user.name || user.username}! 👋</h2>
            
            <p>We noticed it's been ${daysSinceActive} day${daysSinceActive > 1 ? 's' : ''} since your last coding session. Your JavaScript skills are missing you!</p>
            
            ${reminderData.streak ? `
              <div class="streak-box">
                <h3>🔥 Your Streak: ${reminderData.streak} days</h3>
                <p>Don't break the chain! Keep the momentum going.</p>
              </div>
            ` : ''}
            
            ${reminderData.nextLesson ? `
              <p><strong>📚 Up Next:</strong> ${reminderData.nextLesson}</p>
            ` : ''}
            
            <p>Remember, consistency is key to mastering JavaScript. Even 15 minutes of practice can make a huge difference!</p>
            
            <h3>Quick Study Options:</h3>
            <ul>
              <li>🎯 Complete a quick challenge (5-10 mins)</li>
              <li>📖 Read through a tutorial (10-15 mins)</li>
              <li>🧠 Take a quiz to test your knowledge (5 mins)</li>
              <li>💪 Work on your current project (15+ mins)</li>
            </ul>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="cta-button">Continue Learning</a>
            
            <p><small>Feeling a different vibe today? <a href="${process.env.NEXTAUTH_URL}/settings">Switch your mood</a> to match your energy!</small></p>
          </div>
          
          <div class="footer">
            <p>Keep coding, keep growing!<br>The Vibed to Cracked Team</p>
            <p><a href="${process.env.NEXTAUTH_URL}/settings">Update reminder preferences</a></p>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();