import nodemailer from "nodemailer";
import { User } from "@prisma/client";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized?: boolean;
    ciphers?: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || "smtppro.zoho.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
      tls: {
        // More secure: only disable in development, specify servername
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.transporter.verify();
      console.log("✅ Zoho Mail SMTP connection verified successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Zoho Mail SMTP connection failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown connection error",
      };
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          "Vibed to Cracked <noreply@vibed-to-cracked.com>",
        to,
        subject,
        html,
      });

      console.log("Email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Failed to send email via Zoho Mail:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown email error",
      };
    }
  }

  async sendWelcomeEmail(user: User) {
    const subject = "Welcome to Vibed to Cracked! 🚀";
    const html = this.generateWelcomeTemplate(user);

    return await this.sendEmail(user.email, subject, html);
  }

  async sendPromotionalEmail(
    user: User,
    promotion: {
      title: string;
      description: string;
      ctaText: string;
      ctaUrl: string;
    }
  ) {
    const subject = `${promotion.title} - Special Offer Just for You!`;
    const html = this.generatePromotionalTemplate(user, promotion);

    return await this.sendEmail(user.email, subject, html);
  }

  async sendStudyReminderEmail(
    user: User,
    reminderData: {
      lastActive: Date;
      streak?: number;
      nextLesson?: string;
    }
  ) {
    const subject = `Time to get back to coding, ${
      user.name || user.username || "there"
    }! 💪`;
    const html = this.generateStudyReminderTemplate(user, reminderData);

    return await this.sendEmail(user.email, subject, html);
  }

  async sendContactFormEmail(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userAgent?: string;
  }) {
    const subject = `[Contact Form] ${contactData.subject}`;
    const html = this.generateContactFormTemplate(contactData);

    // Send to admin/support email
    const adminEmail = process.env.ADMIN_EMAIL;
    return await this.sendEmail(adminEmail!, subject, html);
  }

  async sendBugReportEmail(bugData: {
    userEmail?: string;
    userName?: string;
    title: string;
    description: string;
    stepsToReproduce: string;
    expectedBehavior: string;
    actualBehavior: string;
    browserInfo?: string;
    url?: string;
    severity: "low" | "medium" | "high" | "critical";
  }) {
    const subject = `[BUG REPORT - ${bugData.severity.toUpperCase()}] ${
      bugData.title
    }`;
    const html = this.generateBugReportTemplate(bugData);

    // Send to development team email
    const devEmail = process.env.ADMIN_EMAIL;
    return await this.sendEmail(devEmail!, subject, html);
  }

  private generateWelcomeTemplate(user: User): string {
    const moodEmojis: Record<string, string> = {
      CHILL: "😎",
      RUSH: "⚡",
      GRIND: "🔥",
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
            <h2>Hey ${user.name || user.username || "there"}! ${
      moodEmojis[user.mood] || "👋"
    }</h2>
            
            <p>Welcome to the most mood-driven JavaScript learning platform on the web! We're excited to have you on board.</p>
            
            <div class="mood-badge">
              <strong>Your Current Mood:</strong> ${user.mood} ${
      moodEmojis[user.mood] || ""
    }
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>🎯 Complete your first tutorial</li>
              <li>💪 Take on some coding challenges</li>
              <li>🏆 Unlock your first achievement</li>
              <li>👥 Connect with other learners</li>
            </ul>
            
            <p>Remember, you can always switch your mood to match how you're feeling - whether you want to CHILL, RUSH, or GRIND!</p>
            
            <a href="${
              process.env.NEXTAUTH_URL
            }/dashboard" class="cta-button">Start Learning Now</a>
            
            <p><small>Pro tip: Set up your study reminders in settings to maintain your coding streak! 🔥</small></p>
          </div>
          
          <div class="footer">
            <p>Happy coding!<br>The Vibed to Cracked Team</p>
            <p><a href="${
              process.env.NEXTAUTH_URL
            }/settings">Update email preferences</a></p>
          </div>
        </body>
      </html>
    `;
  }

  private generatePromotionalTemplate(
    user: User,
    promotion: {
      title: string;
      description: string;
      ctaText: string;
      ctaUrl: string;
    }
  ): string {
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
              <strong>🎯 This offer is personalized for your ${
                user.mood
              } learning style!</strong>
            </div>
            
            <p>Don't miss out on this opportunity to level up your JavaScript skills with premium content and features.</p>
            
            <a href="${promotion.ctaUrl}" class="cta-button">${
      promotion.ctaText
    }</a>
            
            <p><small>This offer expires soon. Take action now! ⏰</small></p>
          </div>
          
          <div class="footer">
            <p>Happy coding!<br>The Vibed to Cracked Team</p>
            <p><a href="${
              process.env.NEXTAUTH_URL
            }/settings">Update email preferences</a> | <a href="${
      process.env.NEXTAUTH_URL
    }/unsubscribe">Unsubscribe</a></p>
          </div>
        </body>
      </html>
    `;
  }

  private generateStudyReminderTemplate(
    user: User,
    reminderData: {
      lastActive: Date;
      streak?: number;
      nextLesson?: string;
    }
  ): string {
    const daysSinceActive = Math.floor(
      (Date.now() - reminderData.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

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
            
            <p>We noticed it's been ${daysSinceActive} day${
      daysSinceActive > 1 ? "s" : ""
    } since your last coding session. Your JavaScript skills are missing you!</p>
            
            ${
              reminderData.streak
                ? `
              <div class="streak-box">
                <h3>🔥 Your Streak: ${reminderData.streak} days</h3>
                <p>Don't break the chain! Keep the momentum going.</p>
              </div>
            `
                : ""
            }
            
            ${
              reminderData.nextLesson
                ? `
              <p><strong>📚 Up Next:</strong> ${reminderData.nextLesson}</p>
            `
                : ""
            }
            
            <p>Remember, consistency is key to mastering JavaScript. Even 15 minutes of practice can make a huge difference!</p>
            
            <h3>Quick Study Options:</h3>
            <ul>
              <li>🎯 Complete a quick challenge (5-10 mins)</li>
              <li>📖 Read through a tutorial (10-15 mins)</li>
              <li>🧠 Take a quiz to test your knowledge (5 mins)</li>
              <li>💪 Work on your current project (15+ mins)</li>
            </ul>
            
            <a href="${
              process.env.NEXTAUTH_URL
            }/dashboard" class="cta-button">Continue Learning</a>
            
            <p><small>Feeling a different vibe today? <a href="${
              process.env.NEXTAUTH_URL
            }/settings">Switch your mood</a> to match your energy!</small></p>
          </div>
          
          <div class="footer">
            <p>Keep coding, keep growing!<br>The Vibed to Cracked Team</p>
            <p><a href="${
              process.env.NEXTAUTH_URL
            }/settings">Update reminder preferences</a></p>
          </div>
        </body>
      </html>
    `;
  }

  private generateContactFormTemplate(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userAgent?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Contact Form Submission</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .info-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .message-box { background: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            .label { font-weight: bold; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📧 Contact Form Submission</h1>
            <p>New message from Vibed to Cracked</p>
          </div>
          
          <div class="content">
            <div class="info-box">
              <p><span class="label">From:</span> ${contactData.name} (${
      contactData.email
    })</p>
              <p><span class="label">Subject:</span> ${contactData.subject}</p>
              <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="message-box">
              <h3>Message:</h3>
              <p style="white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            ${
              contactData.userAgent
                ? `
              <div class="info-box">
                <p><span class="label">User Agent:</span> ${contactData.userAgent}</p>
              </div>
            `
                : ""
            }
          </div>
          
          <div class="footer">
            <p>This email was sent from the Vibed to Cracked contact form.</p>
            <p>Reply directly to this email to respond to ${
              contactData.name
            }.</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateBugReportTemplate(bugData: {
    userEmail?: string;
    userName?: string;
    title: string;
    description: string;
    stepsToReproduce: string;
    expectedBehavior: string;
    actualBehavior: string;
    browserInfo?: string;
    url?: string;
    severity: "low" | "medium" | "high" | "critical";
  }): string {
    const severityColors = {
      low: "#28a745",
      medium: "#ffc107",
      high: "#fd7e14",
      critical: "#dc3545",
    };

    const severityEmojis = {
      low: "🐛",
      medium: "⚠️",
      high: "🚨",
      critical: "🔥",
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bug Report - ${bugData.title}</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .severity-badge { display: inline-block; background: ${
              severityColors[bugData.severity]
            }; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
            .info-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .bug-section { background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .repro-section { background: #d1ecf1; padding: 20px; border-left: 4px solid #bee5eb; margin: 20px 0; }
            .behavior-section { background: #d4edda; padding: 20px; border-left: 4px solid #c3e6cb; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            .label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${severityEmojis[bugData.severity]} Bug Report</h1>
            <p>Issue reported on Vibed to Cracked platform</p>
          </div>
          
          <div class="content">
            <div class="info-section">
              <h2>${bugData.title}</h2>
              <p><span class="severity-badge">${
                bugData.severity
              } Priority</span></p>
              
              ${
                bugData.userName || bugData.userEmail
                  ? `
                <p><span class="label">Reported by:</span> 
                ${bugData.userName ? `${bugData.userName} ` : ""}
                ${bugData.userEmail ? `(${bugData.userEmail})` : ""}</p>
              `
                  : ""
              }
              
              <p><span class="label">Reported:</span> ${new Date().toLocaleString()}</p>
              
              ${
                bugData.url
                  ? `<p><span class="label">Page URL:</span> <a href="${bugData.url}">${bugData.url}</a></p>`
                  : ""
              }
            </div>
            
            <div class="bug-section">
              <span class="label">🐛 Description:</span>
              <p style="white-space: pre-wrap;">${bugData.description}</p>
            </div>
            
            <div class="repro-section">
              <span class="label">🔄 Steps to Reproduce:</span>
              <p style="white-space: pre-wrap;">${bugData.stepsToReproduce}</p>
            </div>
            
            <div class="behavior-section">
              <span class="label">✅ Expected Behavior:</span>
              <p style="white-space: pre-wrap;">${bugData.expectedBehavior}</p>
            </div>
            
            <div class="bug-section">
              <span class="label">❌ Actual Behavior:</span>
              <p style="white-space: pre-wrap;">${bugData.actualBehavior}</p>
            </div>
            
            ${
              bugData.browserInfo
                ? `
              <div class="info-section">
                <span class="label">🌐 Browser Information:</span>
                <pre>${bugData.browserInfo}</pre>
              </div>
            `
                : ""
            }
          </div>
          
          <div class="footer">
            <p>This bug report was submitted through the Vibed to Cracked platform.</p>
            <p><strong>Priority Level:</strong> ${bugData.severity.toUpperCase()}</p>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
