import { prisma } from "@/lib/prisma";
import { ProgressService } from "./progressService";

export interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  type: "FEATURE" | "TECHNICAL" | "DESIGN" | "TESTING";
  priority: "MUST_HAVE" | "SHOULD_HAVE" | "NICE_TO_HAVE";
  points?: number;
}

export interface ProjectResource {
  id: string;
  title: string;
  url: string;
  type: "DOCUMENTATION" | "TUTORIAL" | "EXAMPLE" | "TOOL";
  description?: string;
}

export interface ProjectRubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number; // 0-1, how much this criteria affects overall score
}

export interface ProjectWithDetails {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements: ProjectRequirement[];
  category: string;
  difficulty: number;
  estimatedHours: number;
  order: number;
  published: boolean;
  isPremium: boolean;
  requiredPlan: "FREE" | "VIBED" | "CRACKED";
  submissionType: "CODE" | "LINK" | "FILE";
  reviewType: "PEER" | "INSTRUCTOR" | "AUTO";
  minReviews: number;
  dueDate: Date | null;
  resources: ProjectResource[];
  rubric: ProjectRubricCriteria[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    submissions: number;
  };
}

export interface ProjectSubmissionWithDetails {
  id: string;
  userId: string;
  projectId: string;
  title: string | null;
  description: string | null;
  submissionUrl: string | null;
  submissionFiles: any;
  sourceCode: string | null;
  notes: string | null;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "REVIEWED" | "APPROVED" | "NEEDS_REVISION";
  submittedAt: Date | null;
  reviewedAt: Date | null;
  grade: number | null;
  isPublic: boolean;
  allowFeedback: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  project: {
    id: string;
    title: string;
    category: string;
    difficulty: number;
  };
  reviews: ProjectReviewWithDetails[];
  _count?: {
    reviews: number;
  };
}

export interface ProjectReviewWithDetails {
  id: string;
  submissionId: string;
  reviewerId: string;
  assignmentId: string | null;
  type: "PEER" | "INSTRUCTOR" | "SELF";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  overallScore: number | null;
  criteriaScores: Record<string, number>;
  strengths: string | null;
  improvements: string | null;
  suggestions: string | null;
  isConstructive: boolean | null;
  timeSpent: number | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  reviewer: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

export interface ProjectReviewAssignmentWithDetails {
  id: string;
  submissionId: string;
  reviewerId: string;
  assignedBy: string;
  priority: number;
  status: "ASSIGNED" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "OVERDUE";
  dueDate: Date;
  acceptedAt: Date | null;
  completedAt: Date | null;
  declinedReason: string | null;
  remindersSent: number;
  createdAt: Date;
  updatedAt: Date;
  reviewer: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  submission: {
    id: string;
    title: string | null;
    project: {
      id: string;
      title: string;
    };
    user: {
      id: string;
      name: string | null;
      username: string | null;
    };
  };
}

/**
 * Service for handling project operations
 */
export class ProjectService {
  /**
   * Get all published projects
   */
  static async getAllProjects(): Promise<ProjectWithDetails[]> {
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
        orderBy: [
          { category: "asc" },
          { order: "asc" },
        ],
      });

      return projects.map((project) => ({
        ...project,
        requirements: project.requirements as ProjectRequirement[],
        resources: (project.resources as ProjectResource[]) || [],
        rubric: (project.rubric as ProjectRubricCriteria[]) || [],
        requiredPlan: project.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      }));
    } catch (error) {
      console.error("Error in getAllProjects:", error);
      throw new Error("Failed to fetch projects from database");
    }
  }

  /**
   * Get projects by category
   */
  static async getProjectsByCategory(category: string): Promise<ProjectWithDetails[]> {
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

      return projects.map((project) => ({
        ...project,
        requirements: project.requirements as ProjectRequirement[],
        resources: (project.resources as ProjectResource[]) || [],
        rubric: (project.rubric as ProjectRubricCriteria[]) || [],
        requiredPlan: project.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      }));
    } catch (error) {
      console.error("Error in getProjectsByCategory:", error);
      throw new Error("Failed to fetch projects for category");
    }
  }

  /**
   * Get a specific project by slug
   */
  static async getProjectBySlug(slug: string, userId?: string): Promise<ProjectWithDetails | null> {
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

      return {
        ...project,
        requirements: project.requirements as ProjectRequirement[],
        resources: (project.resources as ProjectResource[]) || [],
        rubric: (project.rubric as ProjectRubricCriteria[]) || [],
        requiredPlan: project.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      };
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

      return {
        ...submission,
        criteriaScores: {},
        reviews: submission.reviews.map((review) => ({
          ...review,
          criteriaScores: (review.criteriaScores as Record<string, number>) || {},
        })),
      };
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
    data: {
      title?: string;
      description?: string;
      submissionUrl?: string;
      submissionFiles?: any;
      sourceCode?: string;
      notes?: string;
      status?: "DRAFT" | "SUBMITTED";
    }
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

      return {
        ...submission,
        reviews: submission.reviews.map((review) => ({
          ...review,
          criteriaScores: (review.criteriaScores as Record<string, number>) || {},
        })),
      };
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
        orderBy: [
          { priority: "desc" },
          { createdAt: "asc" },
        ],
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
  static async acceptReviewAssignment(assignmentId: string, userId: string): Promise<void> {
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
   * Submit a peer review
   */
  static async submitReview(
    assignmentId: string,
    reviewerId: string,
    data: {
      overallScore: number;
      criteriaScores: Record<string, number>;
      strengths?: string;
      improvements?: string;
      suggestions?: string;
      timeSpent?: number;
    }
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

          const averageGrade = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + (review.overallScore || 0), 0) / reviews.length
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
        .filter((user) => user.projectReviewAssignments.length < MAX_CONCURRENT_REVIEWS)
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
  static async getUserProjectStats(userId: string) {
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
            project: {
              select: {
                title: true,
                category: true,
                difficulty: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 5,
        }),
      ]);

      const completedProjects = userProgress.find((p) => p.status === "COMPLETED")?._count.status || 0;
      const inProgressProjects = userProgress.find((p) => p.status === "IN_PROGRESS")?._count.status || 0;
      const notStartedProjects = Math.max(0, totalProjects - completedProjects - inProgressProjects);

      return {
        completed: completedProjects,
        inProgress: inProgressProjects,
        notStarted: notStartedProjects,
        total: totalProjects,
        recentActivity,
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
        orderBy: [
          { reviewedAt: "desc" },
          { grade: "desc" },
        ],
        take: limit,
      });

      return submissions.map((submission) => ({
        ...submission,
        reviews: submission.reviews.map((review) => ({
          ...review,
          criteriaScores: (review.criteriaScores as Record<string, number>) || {},
        })),
      }));
    } catch (error) {
      console.error("Error in getPublicSubmissions:", error);
      throw new Error("Failed to fetch public submissions");
    }
  }
}