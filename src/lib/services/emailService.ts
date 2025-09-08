import nodemailer from "nodemailer";
import { User } from "@prisma/client";
import { devMode } from "./envService";

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
const debugMode = devMode();

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
      if (debugMode) {
        console.log("✅ Zoho Mail SMTP connection verified successfully");
      }
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
      if (debugMode) {
        console.log("Email sent successfully:", info.messageId);
      }
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

  async sendFreeAccessRequestEmail(requestData: {
    name: string;
    email: string;
    country: string;
    age?: number | null;
    occupation: string;
    experience: string;
    reason: string;
    goals: string;
    timeCommitment: string;
    hasTriedOtherPlatforms: string;
    financialSituation: string;
    howFoundUs: string;
    securityInfo: {
      ip: string;
      userAgent: string;
      acceptLanguage: string;
      referer: string;
      timestamp: string;
      requestHeaders: Record<string, string | null>;
    };
  }) {
    const subject = `[FREE ACCESS REQUEST] ${requestData.name} from ${requestData.country}`;
    const html = this.generateFreeAccessRequestTemplate(requestData);

    // Send to admin email
    const adminEmail = process.env.ADMIN_EMAIL;
    return await this.sendEmail(adminEmail!, subject, html);
  }

  async sendPaymentConfirmationEmail(
    user: User,
    paymentData: {
      plan: string;
      amount: number;
      currency: string;
      subscriptionStatus: string;
      subscriptionEndsAt?: Date;
      isTrialActive?: boolean;
      trialEndsAt?: Date;
    }
  ) {
    const subject = `Payment Confirmed - Welcome to ${paymentData.plan}! 🎉`;
    const html = this.generatePaymentConfirmationTemplate(user, paymentData);

    return await this.sendEmail(user.email, subject, html);
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

  private generatePaymentConfirmationTemplate(
    user: User,
    paymentData: {
      plan: string;
      amount: number;
      currency: string;
      subscriptionStatus: string;
      subscriptionEndsAt?: Date;
      isTrialActive?: boolean;
      trialEndsAt?: Date;
    }
  ): string {
    const planEmojis: Record<string, string> = {
      VIBED: "🚀",
      CRACKED: "⚡",
      FREE: "🆓",
    };

    const formatCurrency = (amount: number, currency: string) => {
      const value = amount / 100; // Convert cents to dollars
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(value);
    };

    const formatDate = (date?: Date) => {
      return date
        ? date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Not specified";
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmation - ${paymentData.plan}</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .success-badge { background: #dcfce7; color: #166534; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #bbf7d0; }
            .plan-box { background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
            .payment-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature-list { background: #fefce8; padding: 20px; border-radius: 8px; border-left: 4px solid #eab308; margin: 20px 0; }
            .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            .label { font-weight: bold; color: #374151; }
            .trial-notice { background: #dbeafe; color: #1e40af; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #93c5fd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment Confirmed! ${planEmojis[paymentData.plan] || "🎉"}</h1>
            <p>Welcome to ${paymentData.plan} Plan</p>
          </div>
          
          <div class="content">
            <div class="success-badge">
              <h2>✅ Payment Successfully Processed</h2>
              <p>Your subscription is now active and ready to use!</p>
            </div>

            <h2>Hey ${user.name || user.username}! 👋</h2>
            
            <p>Thank you for upgrading to the ${
              paymentData.plan
            } plan! Your payment has been successfully processed and you now have access to all premium features.</p>

            ${
              paymentData.isTrialActive && paymentData.trialEndsAt
                ? `
              <div class="trial-notice">
                <strong>🎯 Trial Period Active</strong>
                <p>You're currently in a ${
                  paymentData.plan
                } trial period until ${formatDate(
                    paymentData.trialEndsAt
                  )}. After your trial ends, your subscription will automatically continue at the regular price.</p>
              </div>
            `
                : ""
            }
            
            <div class="plan-box">
              <h3>${planEmojis[paymentData.plan]} ${
      paymentData.plan
    } Plan Features</h3>
              ${
                paymentData.plan === "VIBED"
                  ? `
                <ul>
                  <li>✅ Unlimited tutorials and challenges</li>
                  <li>✅ Interactive quiz system</li>
                  <li>✅ Advanced progress tracking</li>
                  <li>✅ Mood-adaptive learning experience</li>
                  <li>✅ Priority support</li>
                </ul>
              `
                  : paymentData.plan === "CRACKED"
                  ? `
                <ul>
                  <li>✅ Everything in Vibed plan</li>
                  <li>✅ AI-powered code reviews</li>
                  <li>✅ 1-on-1 mentorship sessions</li>
                  <li>✅ Early access to new features</li>
                  <li>✅ Premium community access</li>
                  <li>✅ Advanced project templates</li>
                </ul>
              `
                  : ""
              }
            </div>

            <div class="payment-details">
              <h3>📄 Payment Details</h3>
              <p><span class="label">Plan:</span> ${paymentData.plan}</p>
              <p><span class="label">Amount:</span> ${formatCurrency(
                paymentData.amount,
                paymentData.currency
              )}</p>
              <p><span class="label">Status:</span> ${
                paymentData.subscriptionStatus
              }</p>
              ${
                paymentData.subscriptionEndsAt
                  ? `
                <p><span class="label">Next Billing:</span> ${formatDate(
                  paymentData.subscriptionEndsAt
                )}</p>
              `
                  : ""
              }
              <p><span class="label">Date:</span> ${new Date().toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}</p>
            </div>

            <div class="feature-list">
              <h3>🚀 What's Next?</h3>
              <ul>
                <li>🎯 Access all premium tutorials and challenges</li>
                <li>📊 Track your detailed learning progress</li>
                <li>🧠 Take advanced quizzes to test your knowledge</li>
                <li>👥 Join our premium community</li>
                <li>💪 Start working on real-world projects</li>
              </ul>
            </div>
            
            <p>Your learning journey just got supercharged! Switch between CHILL, RUSH, and GRIND modes to match your energy and maximize your coding potential.</p>
            
            <a href="${
              process.env.NEXTAUTH_URL
            }/dashboard" class="cta-button">Start Learning Now 🚀</a>
            
            <p><small>💡 Pro tip: Visit your <a href="${
              process.env.NEXTAUTH_URL
            }/settings">settings page</a> to customize your learning experience and notification preferences.</small></p>
          </div>
          
          <div class="footer">
            <p>🎉 Welcome to the premium experience!<br>The Vibed to Cracked Team</p>
            <p>
              <a href="${
                process.env.NEXTAUTH_URL
              }/settings">Manage Subscription</a> | 
              <a href="${process.env.NEXTAUTH_URL}/contact">Get Support</a>
            </p>
            <p><small>If you have any questions, don't hesitate to reach out. We're here to help you succeed!</small></p>
          </div>
        </body>
      </html>
    `;
  }

  private generateFreeAccessRequestTemplate(requestData: {
    name: string;
    email: string;
    country: string;
    age?: number | null;
    occupation: string;
    experience: string;
    reason: string;
    goals: string;
    timeCommitment: string;
    hasTriedOtherPlatforms: string;
    financialSituation: string;
    howFoundUs: string;
    securityInfo: {
      ip: string;
      userAgent: string;
      acceptLanguage: string;
      referer: string;
      timestamp: string;
      requestHeaders: Record<string, string | null>;
    };
  }): string {
    const riskLevel = this.assessRequestRisk(requestData);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Free Access Request - ${requestData.name}</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .info-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .personal-info { background: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .request-details { background: #f3e5f5; padding: 20px; border-left: 4px solid #9c27b0; margin: 20px 0; }
            .security-info { background: #fff3e0; padding: 20px; border-left: 4px solid #ff9800; margin: 20px 0; }
            .risk-assessment { background: ${
              riskLevel === "high" ? "#ffebee" : riskLevel === "medium" ? "#fff8e1" : "#e8f5e8"
            }; padding: 20px; border-left: 4px solid ${
              riskLevel === "high" ? "#f44336" : riskLevel === "medium" ? "#ffc107" : "#4caf50"
            }; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            .label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
            .value { white-space: pre-wrap; }
            .action-buttons { text-align: center; margin: 30px 0; }
            .approve-btn { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 0 10px; font-weight: bold; }
            .reject-btn { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 0 10px; font-weight: bold; }
            .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .risk-low { background: #dcfce7; color: #166534; }
            .risk-medium { background: #fef3c7; color: #92400e; }
            .risk-high { background: #fecaca; color: #991b1b; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 11px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💝 Free Access Request</h1>
            <p>New request submitted to Vibed to Cracked</p>
            <span class="risk-badge risk-${riskLevel}">Risk Level: ${riskLevel}</span>
          </div>
          
          <div class="content">
            <div class="personal-info">
              <h2>👤 Personal Information</h2>
              <p><span class="label">Name:</span> ${requestData.name}</p>
              <p><span class="label">Email:</span> ${requestData.email}</p>
              <p><span class="label">Country:</span> ${requestData.country}</p>
              <p><span class="label">Age:</span> ${requestData.age || "Not specified"}</p>
              <p><span class="label">Occupation:</span> ${requestData.occupation}</p>
              <p><span class="label">Programming Experience:</span> ${requestData.experience}</p>
              <p><span class="label">How Found Us:</span> ${requestData.howFoundUs}</p>
            </div>

            <div class="request-details">
              <h2>📝 Request Details</h2>
              
              <div style="margin-bottom: 20px;">
                <span class="label">Why requesting free access:</span>
                <div class="value">${requestData.reason}</div>
              </div>

              <div style="margin-bottom: 20px;">
                <span class="label">Learning Goals:</span>
                <div class="value">${requestData.goals}</div>
              </div>

              <div style="margin-bottom: 20px;">
                <span class="label">Time Commitment:</span>
                <div class="value">${requestData.timeCommitment}</div>
              </div>

              <div style="margin-bottom: 20px;">
                <span class="label">Previous Platform Experience:</span>
                <div class="value">${requestData.hasTriedOtherPlatforms}</div>
              </div>

              <div style="margin-bottom: 20px;">
                <span class="label">Financial Situation:</span>
                <div class="value">${requestData.financialSituation}</div>
              </div>
            </div>

            <div class="risk-assessment">
              <h2>⚠️ Risk Assessment</h2>
              <p><span class="label">Risk Level:</span> <span class="risk-badge risk-${riskLevel}">${riskLevel.toUpperCase()}</span></p>
              <p><span class="label">Assessment Notes:</span></p>
              <ul>
                ${this.getRiskAssessmentNotes(requestData).map(note => `<li>${note}</li>`).join('')}
              </ul>
            </div>

            <div class="security-info">
              <h2>🔒 Security Information</h2>
              <p><span class="label">IP Address:</span> ${requestData.securityInfo.ip}</p>
              <p><span class="label">Timestamp:</span> ${new Date(requestData.securityInfo.timestamp).toLocaleString()}</p>
              <p><span class="label">User Agent:</span> ${requestData.securityInfo.userAgent}</p>
              <p><span class="label">Accept Language:</span> ${requestData.securityInfo.acceptLanguage}</p>
              <p><span class="label">Referer:</span> ${requestData.securityInfo.referer}</p>
              
              <details>
                <summary style="cursor: pointer; font-weight: bold; margin: 10px 0;">Request Headers (Click to expand)</summary>
                <pre>${JSON.stringify(requestData.securityInfo.requestHeaders, null, 2)}</pre>
              </details>
            </div>

            <div class="action-buttons">
              <h2>🎯 Review Actions</h2>
              <p>Please review this request and take appropriate action:</p>
              
              <!-- You can create a simple admin panel or handle this manually -->
              <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                <p><strong>Manual Review Required:</strong></p>
                <ol>
                  <li>Verify the information provided seems genuine</li>
                  <li>Check IP address for previous requests</li>
                  <li>Consider the risk assessment level</li>
                  <li>Make a decision and respond via email</li>
                </ol>
              </div>
            </div>

            <div class="info-section">
              <h3>📊 Quick Stats</h3>
              <ul>
                <li><strong>Request Date:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Email Domain:</strong> ${requestData.email.split('@')[1]}</li>
                <li><strong>Country:</strong> ${requestData.country}</li>
                <li><strong>Experience Level:</strong> ${requestData.experience}</li>
                <li><strong>Time Commitment:</strong> ${requestData.timeCommitment}</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Free Access Request System</strong><br>Vibed to Cracked Platform</p>
            <p>This email contains sensitive user information. Please handle with care and follow privacy guidelines.</p>
          </div>
        </body>
      </html>
    `;
  }

  private assessRequestRisk(requestData: {
    name: string;
    email: string;
    reason: string;
    goals: string;
    age?: number | null;
    occupation: string;
  }): "low" | "medium" | "high" {
    let riskScore = 0;

    // Check email domain (free email providers slightly increase risk)
    const emailDomain = requestData.email.split('@')[1]?.toLowerCase();
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', '10minutemail.com', 'tempmail.org'];
    if (freeEmailProviders.some(provider => emailDomain?.includes(provider))) {
      riskScore += 1;
    }

    // Check if reason is too short or generic
    if (requestData.reason.length < 50) {
      riskScore += 2;
    }

    // Check if goals are too generic
    if (requestData.goals.length < 30) {
      riskScore += 1;
    }

    // Check for suspicious patterns
    const suspiciousKeywords = ['test', 'fake', 'lorem', 'asdf', '123'];
    const allText = `${requestData.name} ${requestData.reason} ${requestData.goals}`.toLowerCase();
    if (suspiciousKeywords.some(keyword => allText.includes(keyword))) {
      riskScore += 3;
    }

    // Determine risk level
    if (riskScore >= 4) return "high";
    if (riskScore >= 2) return "medium";
    return "low";
  }

  private getRiskAssessmentNotes(requestData: {
    name: string;
    email: string;
    reason: string;
    goals: string;
    age?: number | null;
    occupation: string;
  }): string[] {
    const notes = [];
    const emailDomain = requestData.email.split('@')[1]?.toLowerCase();

    if (emailDomain && ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'].some(temp => emailDomain.includes(temp))) {
      notes.push("⚠️ Temporary email domain detected");
    }

    if (requestData.reason.length < 50) {
      notes.push("⚠️ Reason for request is quite short");
    }

    if (requestData.goals.length < 30) {
      notes.push("⚠️ Learning goals are briefly described");
    }

    if (!requestData.age) {
      notes.push("ℹ️ Age not provided");
    }

    if (requestData.occupation === "Not specified") {
      notes.push("ℹ️ Occupation not specified");
    }

    if (notes.length === 0) {
      notes.push("✅ No immediate red flags detected");
      notes.push("✅ Information appears complete and genuine");
    }

    return notes;
  }
}

export const emailService = new EmailService();
