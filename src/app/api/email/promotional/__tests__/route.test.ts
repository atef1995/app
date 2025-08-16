import { NextRequest } from 'next/server';
import { POST, GET } from '../route';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';
import { getServerSession } from 'next-auth';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('@/lib/services/emailService', () => ({
  emailService: {
    sendPromotionalEmail: jest.fn(),
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockEmailService = emailService as jest.Mocked<typeof emailService>;
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('/api/email/promotional', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    const mockUsers = [
      {
        id: 'user1',
        email: 'user1@example.com',
        name: 'User One',
        username: 'user1',
        mood: 'CHILL',
        subscription: 'FREE',
        userSettings: {
          emailNotifications: true,
        },
      },
      {
        id: 'user2',
        email: 'user2@example.com',
        name: 'User Two',
        username: 'user2',
        mood: 'RUSH',
        subscription: 'PRO',
        userSettings: {
          emailNotifications: true,
        },
      },
    ];

    const mockPromotion = {
      title: 'Limited Time Offer',
      description: 'Get 50% off premium features!',
      ctaText: 'Claim Offer',
      ctaUrl: 'https://example.com/offer',
    };

    it('should send promotional emails to eligible users successfully', async () => {
      // Mock authenticated session
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      // Mock database query
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      // Mock email service success
      mockEmailService.sendPromotionalEmail.mockResolvedValue({
        success: true,
        messageId: 'msg-123',
      });

      // Create mock request
      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          promotion: mockPromotion,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.totalUsers).toBe(2);
      expect(data.results).toHaveLength(2);
      expect(data.results[0]).toEqual({
        userId: 'user1',
        email: 'user1@example.com',
        success: true,
        messageId: 'msg-123',
        error: undefined,
      });

      // Verify database query
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          id: undefined,
          userSettings: {
            emailNotifications: true,
          },
        },
        include: {
          userSettings: true,
        },
      });

      // Verify email service calls
      expect(mockEmailService.sendPromotionalEmail).toHaveBeenCalledTimes(2);
      expect(mockEmailService.sendPromotionalEmail).toHaveBeenCalledWith(mockUsers[0], mockPromotion);
      expect(mockEmailService.sendPromotionalEmail).toHaveBeenCalledWith(mockUsers[1], mockPromotion);
    });

    it('should send promotional emails to specific users when userIds provided', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      mockPrisma.user.findMany.mockResolvedValue([mockUsers[0]]);
      mockEmailService.sendPromotionalEmail.mockResolvedValue({
        success: true,
        messageId: 'msg-456',
      });

      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          userIds: ['user1'],
          promotion: mockPromotion,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.totalUsers).toBe(1);

      // Verify database query with userIds filter
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['user1'] },
          userSettings: {
            emailNotifications: true,
          },
        },
        include: {
          userSettings: true,
        },
      });
    });

    it('should handle email service failures gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      mockPrisma.user.findMany.mockResolvedValue([mockUsers[0]]);
      
      // Mock email service failure
      mockEmailService.sendPromotionalEmail.mockResolvedValue({
        success: false,
        error: 'SMTP connection failed',
      });

      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          promotion: mockPromotion,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.results[0]).toEqual({
        userId: 'user1',
        email: 'user1@example.com',
        success: false,
        messageId: undefined,
        error: 'SMTP connection failed',
      });
    });

    it('should handle exceptions during email sending', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      mockPrisma.user.findMany.mockResolvedValue([mockUsers[0]]);
      
      // Mock email service throwing an error
      mockEmailService.sendPromotionalEmail.mockRejectedValue(new Error('Network timeout'));

      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          promotion: mockPromotion,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results[0]).toEqual({
        userId: 'user1',
        email: 'user1@example.com',
        success: false,
        error: 'Network timeout',
      });
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          promotion: mockPromotion,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 for missing promotion fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          promotion: {
            title: 'Incomplete Promotion',
            // Missing required fields
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required promotion fields');
    });

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      mockPrisma.user.findMany.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/email/promotional', {
        method: 'POST',
        body: JSON.stringify({
          promotion: mockPromotion,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('GET', () => {
    it('should return promotional email statistics', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      mockPrisma.user.count
        .mockResolvedValueOnce(150) // usersWithEmailEnabled
        .mockResolvedValueOnce(200); // totalUsers

      // Test GET endpoint for promotional email statistics
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        totalUsers: 200,
        usersWithEmailEnabled: 150,
        eligibleForPromotions: 150,
      });

      expect(mockPrisma.user.count).toHaveBeenCalledWith({
        where: {
          userSettings: {
            emailNotifications: true,
          },
        },
      });

      expect(mockPrisma.user.count).toHaveBeenCalledWith();
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'admin-user-id' },
      });

      mockPrisma.user.count.mockRejectedValue(new Error('Database connection failed'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});