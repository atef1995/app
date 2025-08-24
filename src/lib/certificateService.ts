import { prisma } from "@/lib/prisma";
import {
  Certificate,
  CertificateType,
  User,
  Tutorial,
  Category,
} from "@prisma/client";
import { nanoid } from "nanoid";

// Certificate with user information for display
export type CertificateWithUser = Certificate & {
  user: Pick<User, "id" | "name" | "email" | "username">;
};

// Certificate metadata types
export interface TutorialCertificateMetadata {
  score?: number;
  timeSpent?: number;
  difficulty: number;
  quizPassed: boolean;
  completionPercentage: number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface CategoryCertificateMetadata {
  tutorialsCompleted: number;
  totalTutorials: number;
  averageScore?: number;
  totalTimeSpent?: number;
  completionPercentage: number;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Service for handling certificate operations
 */
export class CertificateService {
  /**
   * Generate a tutorial certificate for a user
   */
  static async generateTutorialCertificate(
    userId: string,
    tutorialId: string,
    metadata: TutorialCertificateMetadata
  ): Promise<Certificate | null> {
    try {
      // Get tutorial information
      const tutorial = await prisma.tutorial.findUnique({
        where: { id: tutorialId },
        include: { category: true },
      });

      if (!tutorial) {
        throw new Error("Tutorial not found");
      }

      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_type_entityId: {
            userId,
            type: CertificateType.TUTORIAL,
            entityId: tutorialId,
          },
        },
      });

      if (existingCertificate) {
        // Update existing certificate with new completion data
        return await prisma.certificate.update({
          where: { id: existingCertificate.id },
          data: {
            completedAt: new Date(),
            metadata: metadata,
            updatedAt: new Date(),
          },
        });
      }

      // Generate unique shareable ID
      const shareableId = nanoid(10);
      const shareableUrl = `${process.env.NEXTAUTH_URL}/certificates/share/${shareableId}`;

      // Create new certificate
      const certificate = await prisma.certificate.create({
        data: {
          userId,
          type: CertificateType.TUTORIAL,
          entityId: tutorialId,
          entityTitle: tutorial.title,
          entitySlug: tutorial.slug,
          completedAt: new Date(),
          shareableId,
          shareableUrl,
          isPublic: false, // User can choose to make it public later
          metadata: metadata,
        },
      });

      return certificate;
    } catch (error) {
      console.error("Error generating tutorial certificate:", error);
      return null;
    }
  }

  /**
   * Generate a category certificate for a user
   */
  static async generateCategoryCertificate(
    userId: string,
    categoryId: string
  ): Promise<Certificate | null> {
    try {
      // Get category information
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      // Get all tutorials in the category
      const totalTutorials = await prisma.tutorial.count({
        where: {
          categoryId,
          published: true,
        },
      });

      // Get completed tutorials for this user in this category
      const completedTutorials = await prisma.tutorialProgress.findMany({
        where: {
          userId,
          tutorial: {
            categoryId,
            published: true,
          },
          status: "COMPLETED",
        },
        include: {
          tutorial: true,
        },
      });

      const tutorialsCompleted = completedTutorials.length;

      // Only generate certificate if all tutorials in category are completed
      if (tutorialsCompleted < totalTutorials) {
        return null; // Not eligible for category certificate yet
      }

      // Calculate metadata
      const totalTimeSpent = completedTutorials.reduce(
        (sum, progress) => sum + (progress.timeSpent || 0),
        0
      );

      const averageScore =
        completedTutorials.reduce(
          (sum, progress) => sum + (progress.bestScore || 0),
          0
        ) / tutorialsCompleted;

      const metadata: CategoryCertificateMetadata = {
        tutorialsCompleted,
        totalTutorials,
        averageScore: averageScore || undefined,
        totalTimeSpent,
        completionPercentage: 100,
      };

      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_type_entityId: {
            userId,
            type: CertificateType.CATEGORY,
            entityId: categoryId,
          },
        },
      });

      if (existingCertificate) {
        // Update existing certificate
        return await prisma.certificate.update({
          where: { id: existingCertificate.id },
          data: {
            completedAt: new Date(),
            metadata: metadata,
            updatedAt: new Date(),
          },
        });
      }

      // Generate unique shareable ID
      const shareableId = nanoid(10);
      const shareableUrl = `${process.env.NEXTAUTH_URL}/certificates/share/${shareableId}`;

      // Create new certificate
      const certificate = await prisma.certificate.create({
        data: {
          userId,
          type: CertificateType.CATEGORY,
          entityId: categoryId,
          entityTitle: category.title,
          entitySlug: category.slug,
          completedAt: new Date(),
          shareableId,
          shareableUrl,
          isPublic: false,
          metadata: metadata,
        },
      });

      return certificate;
    } catch (error) {
      console.error("Error generating category certificate:", error);
      return null;
    }
  }

  /**
   * Get user's certificates
   */
  static async getUserCertificates(
    userId: string,
    type?: CertificateType
  ): Promise<Certificate[]> {
    try {
      const where: { userId: string; type?: CertificateType } = { userId };
      if (type) {
        where.type = type;
      }

      return await prisma.certificate.findMany({
        where,
        orderBy: { completedAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      return [];
    }
  }

  /**
   * Get shareable certificate by shareable ID
   */
  static async getShareableCertificate(
    shareableId: string
  ): Promise<CertificateWithUser | null> {
    try {
      return await prisma.certificate.findUnique({
        where: { shareableId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching shareable certificate:", error);
      return null;
    }
  }

  /**
   * Update certificate publicity
   */
  static async updateCertificatePublicity(
    certificateId: string,
    userId: string,
    isPublic: boolean
  ): Promise<Certificate | null> {
    try {
      return await prisma.certificate.update({
        where: {
          id: certificateId,
          userId, // Ensure user owns the certificate
        },
        data: { isPublic },
      });
    } catch (error) {
      console.error("Error updating certificate publicity:", error);
      return null;
    }
  }

  /**
   * Get public certificates for showcase
   */
  static async getPublicCertificates(
    limit: number = 50,
    offset: number = 0
  ): Promise<CertificateWithUser[]> {
    try {
      return await prisma.certificate.findMany({
        where: { isPublic: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      console.error("Error fetching public certificates:", error);
      return [];
    }
  }

  /**
   * Check if user is eligible for category certificate
   */
  static async checkCategoryEligibility(
    userId: string,
    categoryId: string
  ): Promise<{
    isEligible: boolean;
    completed: number;
    total: number;
    remaining?: string[];
  }> {
    try {
      // Get all published tutorials in the category
      const allTutorials = await prisma.tutorial.findMany({
        where: {
          categoryId,
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      });

      // Get completed tutorials for this user
      const completedTutorialProgress = await prisma.tutorialProgress.findMany({
        where: {
          userId,
          tutorial: {
            categoryId,
            published: true,
          },
          status: "COMPLETED",
        },
        select: {
          tutorialId: true,
        },
      });

      const completedIds = new Set(
        completedTutorialProgress.map((p) => p.tutorialId)
      );
      const completed = completedIds.size;
      const total = allTutorials.length;
      const isEligible = completed >= total;

      const remaining = isEligible
        ? undefined
        : allTutorials
            .filter((tutorial) => !completedIds.has(tutorial.id))
            .map((tutorial) => tutorial.title);

      return {
        isEligible,
        completed,
        total,
        remaining,
      };
    } catch (error) {
      console.error("Error checking category eligibility:", error);
      return {
        isEligible: false,
        completed: 0,
        total: 0,
      };
    }
  }
}
