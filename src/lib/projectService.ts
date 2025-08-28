import { prisma } from "@/lib/prisma";
import { ProgressService } from "./progressService";
import {
  Project,
  ProjectSubmission,
  ProjectReview,
  ProjectReviewAssignment,
  User,
  Prisma,
} from "@prisma/client";

// Prisma types for projects with relationships
export type ProjectWithCount = Project & {
  _count: {
    submissions: number;
  };
};

export type ProjectSubmissionWithDetails = ProjectSubmission & {
  user: Pick<User, "id" | "name" | "username" | "image">;
  project: Pick<Project, "id" | "title" | "category" | "difficulty">;
  reviews: (ProjectReview & {
    reviewer: Pick<User, "id" | "name" | "username" | "image">;
  })[];
  _count: {
    reviews: number;
  };
};

export type ProjectReviewAssignmentWithDetails = ProjectReviewAssignment & {
  reviewer: Pick<User, "id" | "name" | "username" | "image">;
  submission: {
    id: string;
    title: string | null;
    project: Pick<Project, "id" | "title">;
    user: Pick<User, "id" | "name" | "username">;
  };
  type?: string;
};

export interface CreateProjectSubmissionRequest {
  title?: string;
  description?: string;
  submissionUrl?: string;
  submissionFiles?: Prisma.InputJsonValue;
  sourceCode?: string;
  notes?: string;
  status: string;
}

export interface ProjectReviewRequest {
  overallScore?: number;
  criteriaScores?: Record<string, number>;
  strengths?: string;
  improvements?: string;
  suggestions?: string;
  timeSpent?: number;
}

export interface ProjectStats {
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
  recentActivity: ProjectSubmissionWithDetails[];
}

/**
 * Service for handling project operations
 */
export class ProjectService {
  /**
   * Get all published projects
   */
  static async getAllProjects(): Promise<ProjectWithCount[]> {
    try {
      const projects = await prisma.project.findMany({
        where: {
          published: true,
        },
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      });

      return projects;
    } catch (error) {
      console.error("Error in getAllProjects:", error);
      throw new Error("Failed to fetch projects from database");
    }
  }

  /**
   * Get projects by category
   */
  static async getProjectsByCategory(
    category: string
  ): Promise<ProjectWithCount[]> {
    try {
      const projects = await prisma.project.findMany({
        where: {
          published: true,
          category: category,
        },
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      return projects;
    } catch (error) {
      console.error("Error in getProjectsByCategory:", error);
      throw new Error("Failed to fetch projects for category");
    }
  }

  /**
   * Get a specific project by slug
   */
  static async getProjectBySlug(
    slug: string,
    userId?: string
  ): Promise<ProjectWithCount | null> {
    try {
      const project = await prisma.project.findUnique({
        where: {
          slug,
          published: true,
        },
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      });

      if (!project) return null;

      // Mark project as started if user is provided
      if (userId) {
        await ProgressService.markProjectStarted(userId, project.id);
      }

      return project;
    } catch (error) {
      console.error("Error in getProjectBySlug:", error);
      throw new Error("Failed to fetch project");
    }
  }

  /**
   * Get user's submission for a project
   */
  static async getUserSubmission(
    userId: string,
    projectId: string
  ): Promise<ProjectSubmissionWithDetails | null> {
    try {
      const submission = await prisma.projectSubmission.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              category: true,
              difficulty: true,
            },
          },
          reviews: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      if (!submission) return null;

      return submission;
    } catch (error) {
      console.error("Error in getUserSubmission:", error);
      throw new Error("Failed to fetch user submission");
    }
  }

  /**
   * Create or update a project submission
   */
  static async upsertSubmission(
    userId: string,
    projectId: string,
    data: CreateProjectSubmissionRequest
  ): Promise<ProjectSubmissionWithDetails> {
    try {
      const submission = await prisma.projectSubmission.upsert({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
        update: {
          ...data,
          submittedAt: data.status === "SUBMITTED" ? new Date() : undefined,
          updatedAt: new Date(),
        },
        create: {
          userId,
          projectId,
          ...data,
          submittedAt: data.status === "SUBMITTED" ? new Date() : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              category: true,
              difficulty: true,
            },
          },
          reviews: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      // If submitted, trigger peer review assignment and mark progress
      if (data.status === "SUBMITTED") {
        await this.assignPeerReviewers(submission.id);

        // Track progress when project is submitted
        await ProgressService.submitProjectSubmission(userId, {
          projectId,
          status: data.status,
          grade: undefined,
          timeSpent: 0, // Could be tracked from frontend
          mood: "NEUTRAL", // Could be passed from frontend
        });
      }

      return submission;
    } catch (error) {
      console.error("Error in upsertSubmission:", error);
      throw new Error("Failed to save submission");
    }
  }

  /**
   * Get submissions for review by a user
   */
  static async getReviewAssignments(
    userId: string,
    status?: string[]
  ): Promise<ProjectReviewAssignmentWithDetails[]> {
    try {
      const assignments = await prisma.projectReviewAssignment.findMany({
        where: {
          reviewerId: userId,
          status: status ? { in: status } : undefined,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          submission: {
            select: {
              id: true,
              title: true,
              project: {
                select: {
                  id: true,
                  title: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      });

      return assignments;
    } catch (error) {
      console.error("Error in getReviewAssignments:", error);
      throw new Error("Failed to fetch review assignments");
    }
  }

  /**
   * Accept a review assignment
   */
  static async acceptReviewAssignment(
    assignmentId: string,
    userId: string
  ): Promise<void> {
    try {
      await prisma.projectReviewAssignment.update({
        where: {
          id: assignmentId,
          reviewerId: userId,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error in acceptReviewAssignment:", error);
      throw new Error("Failed to accept review assignment");
    }
  }

  /**
   * Reject a review assignment
   */
  static async rejectReviewAssignment(
    assignmentId: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Update assignment status to rejected
        await tx.projectReviewAssignment.update({
          where: {
            id: assignmentId,
            reviewerId: userId,
          },
          data: {
            status: "REJECTED",
            rejectedAt: new Date(),
            rejectionReason: reason,
          },
        });

        // Get assignment details
        const assignment = await tx.projectReviewAssignment.findUnique({
          where: { id: assignmentId },
          include: {
            submission: {
              include: {
                project: {
                  select: {
                    minReviews: true,
                    category: true,
                    difficulty: true,
                  },
                },
              },
            },
          },
        });

        if (assignment) {
          // Schedule replacement assignment outside transaction
          setImmediate(() => {
            this.handleRejectedAssignment(assignment.submissionId).catch(
              (err) => console.error("Error handling rejected assignment:", err)
            );
          });
        }
      });
    } catch (error) {
      console.error("Error in rejectReviewAssignment:", error);
      throw new Error("Failed to reject review assignment");
    }
  }

  /**
   * Check if user is admin
   */
  static async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      return user?.role === "ADMIN" || user?.role === "INSTRUCTOR";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  /**
   * Assign admin reviewer to a submission
   */
  static async assignAdminReviewer(
    submissionId: string,
    adminUserId?: string
  ): Promise<void> {
    try {
      // If no specific admin provided, find available admin users
      let reviewerId = adminUserId;

      if (!reviewerId) {
        const admins = await prisma.user.findMany({
          where: {
            role: { in: ["ADMIN", "INSTRUCTOR"] },
          },
          select: { id: true },
          take: 1,
        });

        if (admins.length === 0) {
          throw new Error("No admin users available for review");
        }

        reviewerId = admins[0].id;
      }

      // Create admin assignment
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // 3 days for admin review

      await prisma.projectReviewAssignment.create({
        data: {
          submissionId,
          reviewerId: reviewerId!,
          priority: 999, // Highest priority
          dueDate,
          status: "ASSIGNED",
          type: "ADMIN",
          expiredAt: new Date(), // Will be updated when actually expired
          rejectedAt: new Date(), // Will be updated when actually rejected  
          rejectionReason: "", // Will be updated when actually rejected
        },
      });
    } catch (error) {
      console.error("Error in assignAdminReviewer:", error);
      throw new Error("Failed to assign admin reviewer");
    }
  }

  /**
   * Handle rejected assignment by finding replacement or assigning admin
   */
  private static async handleRejectedAssignment(
    submissionId: string
  ): Promise<void> {
    try {
      const submission = await prisma.projectSubmission.findUnique({
        where: { id: submissionId },
        include: {
          project: {
            select: {
              minReviews: true,
              category: true,
              difficulty: true,
            },
          },
          reviewAssignments: {
            where: {
              status: { in: ["ASSIGNED", "ACCEPTED"] },
            },
          },
        },
      });

      if (!submission) return;

      const activeReviewers = submission.reviewAssignments.length;
      const needsMore = submission.project.minReviews - activeReviewers;

      if (needsMore > 0) {
        // Try to find replacement peer reviewers
        const potentialReviewers = await this.findPotentialReviewers(
          submission.userId,
          submission.project.category,
          submission.project.difficulty,
          needsMore
        );

        if (potentialReviewers.length > 0) {
          // Assign new peer reviewers
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 7);

          const assignments = potentialReviewers.map((reviewerId, index) => ({
            submissionId,
            reviewerId,
            priority: index + 1,
            dueDate,
            status: "ASSIGNED" as const,
            type: "PEER" as const,
            expiredAt: new Date(), // Will be updated when actually expired
            rejectedAt: new Date(), // Will be updated when actually rejected  
            rejectionReason: "", // Will be updated when actually rejected
          }));

          await prisma.projectReviewAssignment.createMany({
            data: assignments,
            skipDuplicates: true,
          });
        } else {
          // No peer reviewers available, assign admin
          await this.assignAdminReviewer(submissionId);
        }
      }
    } catch (error) {
      console.error("Error in handleRejectedAssignment:", error);
    }
  }

  /**
   * Handle expired review assignments
   */
  static async handleExpiredAssignments(): Promise<void> {
    try {
      const expiredAssignments = await prisma.projectReviewAssignment.findMany({
        where: {
          status: "ASSIGNED",
          dueDate: {
            lt: new Date(),
          },
        },
        include: {
          submission: {
            include: {
              project: {
                select: {
                  minReviews: true,
                  category: true,
                  difficulty: true,
                },
              },
            },
          },
        },
      });

      for (const assignment of expiredAssignments) {
        // Mark as expired
        await prisma.projectReviewAssignment.update({
          where: { id: assignment.id },
          data: {
            status: "EXPIRED",
            expiredAt: new Date(),
          },
        });

        // Try to reassign
        await this.handleRejectedAssignment(assignment.submissionId);
      }
    } catch (error) {
      console.error("Error in handleExpiredAssignments:", error);
      throw new Error("Failed to handle expired assignments");
    }
  }

  /**
   * Submit a peer review
   */
  static async submitReview(
    assignmentId: string,
    reviewerId: string,
    data: ProjectReviewRequest
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Get the assignment
        const assignment = await tx.projectReviewAssignment.findUnique({
          where: { id: assignmentId },
        });

        if (!assignment) {
          throw new Error("Assignment not found");
        }

        // Create the review
        await tx.projectReview.create({
          data: {
            submissionId: assignment.submissionId,
            reviewerId,
            assignmentId,
            type: "PEER",
            status: "COMPLETED",
            overallScore: data.overallScore,
            criteriaScores: data.criteriaScores,
            strengths: data.strengths,
            improvements: data.improvements,
            suggestions: data.suggestions,
            timeSpent: data.timeSpent,
            submittedAt: new Date(),
          },
        });

        // Update assignment status
        await tx.projectReviewAssignment.update({
          where: { id: assignmentId },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        // Check if submission has enough reviews to be marked as reviewed
        const reviewCount = await tx.projectReview.count({
          where: {
            submissionId: assignment.submissionId,
            status: "COMPLETED",
          },
        });

        const project = await tx.projectSubmission.findUnique({
          where: { id: assignment.submissionId },
          select: { project: { select: { minReviews: true } } },
        });

        if (project && reviewCount >= project.project.minReviews) {
          // Calculate average grade from reviews
          const reviews = await tx.projectReview.findMany({
            where: {
              submissionId: assignment.submissionId,
              status: "COMPLETED",
            },
            select: { overallScore: true },
          });

          const averageGrade =
            reviews.length > 0
              ? reviews.reduce(
                  (sum, review) => sum + (review.overallScore || 0),
                  0
                ) / reviews.length
              : 0;

          // Update submission status
          await tx.projectSubmission.update({
            where: { id: assignment.submissionId },
            data: {
              status: "REVIEWED",
              reviewedAt: new Date(),
              grade: averageGrade,
            },
          });

          // Update progress tracking
          const submission = await tx.projectSubmission.findUnique({
            where: { id: assignment.submissionId },
            select: { userId: true, projectId: true },
          });

          if (submission) {
            await ProgressService.submitProjectSubmission(submission.userId, {
              projectId: submission.projectId,
              status: "REVIEWED",
              grade: averageGrade,
              timeSpent: 0,
              mood: "NEUTRAL",
            });
          }
        }
      });
    } catch (error) {
      console.error("Error in submitReview:", error);
      throw new Error("Failed to submit review");
    }
  }

  /**
   * Assign peer reviewers to a submission
   */
  static async assignPeerReviewers(submissionId: string): Promise<void> {
    try {
      const submission = await prisma.projectSubmission.findUnique({
        where: { id: submissionId },
        include: {
          project: {
            select: {
              minReviews: true,
              category: true,
              difficulty: true,
            },
          },
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      // Find potential reviewers
      const potentialReviewers = await this.findPotentialReviewers(
        submission.userId,
        submission.project.category,
        submission.project.difficulty,
        submission.project.minReviews
      );

      // Create review assignments
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // 1 week to complete review

      const assignments = potentialReviewers.map((reviewerId, index) => ({
        submissionId,
        reviewerId,
        priority: potentialReviewers.length - index, // First reviewer gets highest priority
        dueDate,
        status: "ASSIGNED" as const,
        type: "PEER" as const,
        expiredAt: new Date(), // Will be updated when actually expired
        rejectedAt: new Date(), // Will be updated when actually rejected  
        rejectionReason: "", // Will be updated when actually rejected
      }));

      await prisma.projectReviewAssignment.createMany({
        data: assignments,
        skipDuplicates: true,
      });

      // Update submission status
      await prisma.projectSubmission.update({
        where: { id: submissionId },
        data: { status: "UNDER_REVIEW" },
      });
    } catch (error) {
      console.error("Error in assignPeerReviewers:", error);
      throw new Error("Failed to assign peer reviewers");
    }
  }

  /**
   * Find potential reviewers for a submission
   */
  private static async findPotentialReviewers(
    submitterId: string,
    category: string,
    difficulty: number,
    minReviews: number
  ): Promise<string[]> {
    try {
      // Find users who have completed projects in the same or higher difficulty category
      const potentialReviewers = await prisma.user.findMany({
        where: {
          id: { not: submitterId }, // Don't assign submitter as reviewer
          projectSubmissions: {
            some: {
              status: { in: ["REVIEWED", "APPROVED"] },
              project: {
                category,
                difficulty: { gte: difficulty },
              },
            },
          },
        },
        select: {
          id: true,
          projectReviewAssignments: {
            where: {
              status: { in: ["ASSIGNED", "ACCEPTED"] },
              dueDate: { gte: new Date() },
            },
            select: { id: true },
          },
        },
        orderBy: {
          createdAt: "asc", // Prioritize older users (more experienced)
        },
      });

      // Filter out users who are already overloaded with reviews
      const MAX_CONCURRENT_REVIEWS = 3;
      const availableReviewers = potentialReviewers
        .filter(
          (user) =>
            user.projectReviewAssignments.length < MAX_CONCURRENT_REVIEWS
        )
        .map((user) => user.id);

      // If not enough reviewers, fall back to instructor review
      if (availableReviewers.length < minReviews) {
        // In a real application, you'd have instructor user IDs
        // For now, we'll just use the available reviewers and let the system
        // handle the case where there aren't enough
        console.warn(
          `Not enough peer reviewers available. Found ${availableReviewers.length}, needed ${minReviews}`
        );
      }

      return availableReviewers.slice(0, minReviews);
    } catch (error) {
      console.error("Error in findPotentialReviewers:", error);
      return [];
    }
  }

  /**
   * Get all project categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.project.findMany({
        where: {
          published: true,
        },
        select: {
          category: true,
        },
        distinct: ["category"],
      });

      return categories
        .map((c) => c.category)
        .filter(Boolean)
        .sort();
    } catch (error) {
      console.error("Error fetching project categories:", error);
      return ["fundamentals", "oop", "async", "dom", "advanced"];
    }
  }

  /**
   * Get user's project statistics
   */
  static async getUserProjectStats(userId: string): Promise<ProjectStats> {
    try {
      const [userProgress, totalProjects, recentActivity] = await Promise.all([
        // User's project progress
        prisma.projectProgress.groupBy({
          by: ["status"],
          where: { userId },
          _count: {
            status: true,
          },
        }),

        // Total available projects
        prisma.project.count({ where: { published: true } }),

        // Recent project activity
        prisma.projectSubmission.findMany({
          where: { userId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            project: {
              select: {
                id: true,
                title: true,
                category: true,
                difficulty: true,
              },
            },
            reviews: {
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 5,
        }),
      ]);

      const completedProjects =
        userProgress.find((p) => p.status === "COMPLETED")?._count.status || 0;
      const inProgressProjects =
        userProgress.find((p) => p.status === "IN_PROGRESS")?._count.status ||
        0;
      const notStartedProjects = Math.max(
        0,
        totalProjects - completedProjects - inProgressProjects
      );

      return {
        completed: completedProjects,
        inProgress: inProgressProjects,
        notStarted: notStartedProjects,
        total: totalProjects,
        recentActivity: recentActivity,
      };
    } catch (error) {
      console.error("Error in getUserProjectStats:", error);
      return {
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        total: 0,
        recentActivity: [],
      };
    }
  }

  /**
   * Get public submissions for showcase
   */
  static async getPublicSubmissions(
    category?: string,
    limit: number = 20
  ): Promise<ProjectSubmissionWithDetails[]> {
    try {
      const submissions = await prisma.projectSubmission.findMany({
        where: {
          isPublic: true,
          status: { in: ["REVIEWED", "APPROVED"] },
          project: category ? { category } : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              category: true,
              difficulty: true,
            },
          },
          reviews: {
            where: {
              status: "COMPLETED",
            },
            include: {
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: [{ reviewedAt: "desc" }, { grade: "desc" }],
        take: limit,
      });

      return submissions;
    } catch (error) {
      console.error("Error in getPublicSubmissions:", error);
      throw new Error("Failed to fetch public submissions");
    }
  }
}
