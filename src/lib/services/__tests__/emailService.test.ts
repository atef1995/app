import { emailService } from '../emailService';
import nodemailer from 'nodemailer';
import { User } from '@prisma/client';

// Mock nodemailer
jest.mock('nodemailer');

const mockNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('EmailService', () => {
  let mockTransporter: jest.Mocked<nodemailer.Transporter>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock transporter
    mockTransporter = {
      sendMail: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<nodemailer.Transporter>;

    mockNodemailer.createTransporter.mockReturnValue(mockTransporter);
  });

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    username: 'testuser',
    mood: 'CHILL',
    subscription: 'FREE',
    subscriptionStatus: 'INACTIVE',
    subscriptionEndsAt: null,
    stripeCustomerId: null,
    emailVerified: null,
    image: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    role: 'USER',
    // Anonymous conversion attribution fields
    conversionSource: null,
    conversionMedium: null,
    conversionCampaign: null,
    firstLandingPage: null,
    anonymousSessionId: null,
  };

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const mockInfo = { messageId: 'test-message-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      const result = await emailService.sendEmail(
        'test@example.com',
        'Test Subject',
        '<p>Test HTML content</p>'
      );

      expect(result).toEqual({
        success: true,
        messageId: 'test-message-id',
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM || 'Vibed to Cracked <noreply@vibedtocracked.com>',
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML content</p>',
      });
    });

    it('should handle email sending errors', async () => {
      const mockError = new Error('SMTP connection failed');
      mockTransporter.sendMail.mockRejectedValue(mockError);

      const result = await emailService.sendEmail(
        'test@example.com',
        'Test Subject',
        '<p>Test HTML content</p>'
      );

      expect(result).toEqual({
        success: false,
        error: 'SMTP connection failed',
      });
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct content', async () => {
      const mockInfo = { messageId: 'welcome-message-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      const result = await emailService.sendWelcomeEmail(mockUser);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('welcome-message-id');

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM || 'Vibed to Cracked <noreply@vibedtocracked.com>',
        to: 'test@example.com',
        subject: 'Welcome to Vibed to Cracked! 🚀',
        html: expect.stringContaining('Test User'),
      });

      // Check that the HTML contains user-specific content
      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('Test User');
      expect(sentEmail.html).toContain('CHILL');
      expect(sentEmail.html).toContain('😎'); // CHILL mood emoji
    });

    it('should handle different moods correctly', async () => {
      const rushUser = { ...mockUser, mood: 'RUSH' as const };
      const grindUser = { ...mockUser, mood: 'GRIND' as const };

      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test' });

      // Test RUSH mood
      await emailService.sendWelcomeEmail(rushUser);
      let sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('RUSH');
      expect(sentEmail.html).toContain('⚡');

      // Reset mock
      mockTransporter.sendMail.mockClear();

      // Test GRIND mood
      await emailService.sendWelcomeEmail(grindUser);
      sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('GRIND');
      expect(sentEmail.html).toContain('🔥');
    });

    it('should handle missing name gracefully', async () => {
      const userWithoutName = { ...mockUser, name: null };
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test' });

      await emailService.sendWelcomeEmail(userWithoutName);

      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('testuser'); // Should use username instead
    });
  });

  describe('sendPromotionalEmail', () => {
    const mockPromotion = {
      title: 'Limited Time Offer',
      description: 'Get 50% off premium features for your first month!',
      ctaText: 'Claim Offer',
      ctaUrl: 'https://example.com/offer',
    };

    it('should send promotional email with correct content', async () => {
      const mockInfo = { messageId: 'promo-message-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      const result = await emailService.sendPromotionalEmail(mockUser, mockPromotion);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('promo-message-id');

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM || 'Vibed to Cracked <noreply@vibedtocracked.com>',
        to: 'test@example.com',
        subject: 'Limited Time Offer - Special Offer Just for You!',
        html: expect.stringContaining('Test User'),
      });

      // Check promotional content
      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('Limited Time Offer');
      expect(sentEmail.html).toContain('Get 50% off premium features');
      expect(sentEmail.html).toContain('Claim Offer');
      expect(sentEmail.html).toContain('https://example.com/offer');
      expect(sentEmail.html).toContain('CHILL learning style');
    });
  });

  describe('sendStudyReminderEmail', () => {
    const mockReminderData = {
      lastActive: new Date('2024-01-01'),
      streak: 5,
      nextLesson: 'JavaScript Arrays and Objects',
    };

    beforeAll(() => {
      // Mock current date for consistent testing
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-04')); // 3 days after last active
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should send study reminder email with correct content', async () => {
      const mockInfo = { messageId: 'reminder-message-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      const result = await emailService.sendStudyReminderEmail(mockUser, mockReminderData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('reminder-message-id');

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM || 'Vibed to Cracked <noreply@vibedtocracked.com>',
        to: 'test@example.com',
        subject: 'Time to get back to coding, Test User! 💪',
        html: expect.stringContaining('Test User'),
      });

      // Check reminder content
      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('3 days since your last');
      expect(sentEmail.html).toContain('Your Streak: 5 days');
      expect(sentEmail.html).toContain('JavaScript Arrays and Objects');
      expect(sentEmail.html).toContain('chill zone');
    });

    it('should handle missing streak gracefully', async () => {
      const reminderDataWithoutStreak = {
        lastActive: new Date('2024-01-01'),
        nextLesson: 'JavaScript Basics',
      };

      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test' });

      await emailService.sendStudyReminderEmail(mockUser, reminderDataWithoutStreak);

      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).not.toContain('Your Streak:');
      expect(sentEmail.html).toContain('JavaScript Basics');
    });

    it('should handle missing next lesson gracefully', async () => {
      const reminderDataWithoutLesson = {
        lastActive: new Date('2024-01-01'),
        streak: 3,
      };

      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test' });

      await emailService.sendStudyReminderEmail(mockUser, reminderDataWithoutLesson);

      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('Your Streak: 3 days');
      expect(sentEmail.html).not.toContain('Up Next:');
    });

    it('should calculate days since last active correctly', async () => {
      const recentReminderData = {
        lastActive: new Date('2024-01-03'), // 1 day ago
        streak: 2,
      };

      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test' });

      await emailService.sendStudyReminderEmail(mockUser, recentReminderData);

      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.html).toContain('1 day since your last');
      expect(sentEmail.html).not.toContain('1 days since'); // Proper pluralization
    });

    it('should use fallback name when user name is missing', async () => {
      const userWithoutName = { ...mockUser, name: null, username: null };
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test' });

      await emailService.sendStudyReminderEmail(userWithoutName, mockReminderData);

      const sentEmail = mockTransporter.sendMail.mock.calls[0][0];
      expect(sentEmail.subject).toContain('there!'); // Should use fallback
    });
  });
});