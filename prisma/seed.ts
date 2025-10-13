import { PrismaClient } from "@prisma/client";
import { basicChallenges } from "../src/data/challenges/basic";
import { algorithmChallenges } from "../src/data/challenges/algorithms";
import { slugify, generateUniqueSlug } from "../src/lib/slugify";
import { seedChallenges } from "./seedChallenges";
import { seedPhases } from "./seedPhases";
import { seedNodejsTutorials } from "./seedNodejsTutorials";

const prisma = new PrismaClient();

/**
 * Seed Contribution Projects
 *
 * Seeds the portfolio-site-template project with 5 features for PR contributions
 */
async function seedContributionProjects() {
  console.log("🚀 Seeding Contribution Projects...");

  const portfolioProject = await prisma.contributionProject.upsert({
    where: { slug: "portfolio-site-template" },
    update: {},
    create: {
      slug: "portfolio-site-template",
      title: "Portfolio Site Template",
      description:
        "Build a modern, responsive portfolio website with Next.js and Tailwind CSS. Perfect for beginners to learn real-world development workflows with GitHub PRs and code reviews.",
      githubRepoUrl: "https://github.com/atef1995/portfolio-site-template",
      githubOwner: "atef1995",
      githubRepo: "portfolio-site-template",
      category: "frontend",
      difficulty: 2,
      estimatedHours: 20,
      xpReward: 500,
      isPremium: false,
      requiredPlan: "FREE",
      published: true,

      features: [
        {
          id: "dark-mode-toggle",
          title: "Dark Mode Toggle",
          description:
            "Implement a dark mode toggle that persists user preference across sessions",
          difficulty: 1,
          estimatedHours: 3,
          xpReward: 100,
          requirements: [
            "Create a toggle button component",
            "Implement theme switching with Tailwind dark: classes",
            "Store preference in localStorage",
            "Apply dark styles to all pages",
            "Add smooth transition animations",
          ],
          acceptanceCriteria: [
            "Toggle switches between light and dark themes",
            "Preference persists across browser sessions",
            "All text remains readable in both modes",
            "No layout shifts when switching themes",
            "Button has proper ARIA labels for accessibility",
          ],
          testCases: [
            "User can click toggle to switch themes",
            "Theme preference is saved to localStorage",
            "Page loads with previously saved theme",
            "All components support both themes",
          ],
        },
        {
          id: "contact-form",
          title: "Contact Form with Validation",
          description:
            "Build a fully functional contact form with client-side validation and email integration",
          difficulty: 2,
          estimatedHours: 4,
          xpReward: 150,
          requirements: [
            "Create contact form component with name, email, message fields",
            "Implement client-side validation",
            "Add email service integration (e.g., Resend, SendGrid)",
            "Display success/error messages",
            "Add rate limiting to prevent spam",
          ],
          acceptanceCriteria: [
            "Form validates email format",
            "All required fields show error messages when empty",
            "Success message appears after submission",
            "Email is sent to configured address",
            "Form resets after successful submission",
          ],
          testCases: [
            "Form shows validation errors for invalid email",
            "Form cannot be submitted with empty fields",
            "Success message displays on valid submission",
            "Email is received at destination",
          ],
        },
        {
          id: "blog-section",
          title: "Blog Section with MDX",
          description:
            "Create a blog section that renders MDX content with syntax highlighting and reading time",
          difficulty: 3,
          estimatedHours: 6,
          xpReward: 250,
          requirements: [
            "Set up MDX rendering with next-mdx-remote",
            "Create blog post listing page",
            "Implement individual blog post pages",
            "Add syntax highlighting for code blocks",
            "Calculate and display reading time",
            "Add responsive images",
          ],
          acceptanceCriteria: [
            "Blog posts render from MDX files",
            "Code blocks have proper syntax highlighting",
            "Reading time is calculated correctly",
            "Images are responsive and optimized",
            "Blog listing shows all posts sorted by date",
            "Individual post pages have proper metadata",
          ],
          testCases: [
            "MDX content renders correctly",
            "Code syntax highlighting works",
            "Reading time displays on all posts",
            "Blog listing page loads without errors",
          ],
        },
        {
          id: "admin-dashboard",
          title: "Admin Dashboard with Analytics",
          description:
            "Build a protected admin dashboard with basic analytics and content management",
          difficulty: 4,
          estimatedHours: 8,
          xpReward: 400,
          requirements: [
            "Implement authentication guard for admin routes",
            "Create dashboard layout with navigation",
            "Add analytics charts (page views, form submissions)",
            "Build content management interface",
            "Implement role-based access control",
          ],
          acceptanceCriteria: [
            "Only authenticated admin users can access dashboard",
            "Analytics charts display data correctly",
            "Content can be created/edited/deleted",
            "Dashboard is responsive on all devices",
            "All actions are logged for audit trail",
          ],
          testCases: [
            "Unauthenticated users are redirected to login",
            "Non-admin users cannot access dashboard",
            "Analytics data updates in real-time",
            "Content changes persist to database",
          ],
        },
        {
          id: "analytics-integration",
          title: "Google Analytics & Performance Monitoring",
          description:
            "Integrate Google Analytics 4 and implement performance monitoring",
          difficulty: 4,
          estimatedHours: 5,
          xpReward: 350,
          requirements: [
            "Set up Google Analytics 4 integration",
            "Implement page view tracking",
            "Add custom event tracking (form submissions, button clicks)",
            "Set up performance monitoring with Web Vitals",
            "Create privacy-friendly cookie consent banner",
          ],
          acceptanceCriteria: [
            "GA4 tracks page views correctly",
            "Custom events appear in GA4 dashboard",
            "Web Vitals metrics are collected",
            "Cookie consent banner follows GDPR guidelines",
            "User can opt out of tracking",
          ],
          testCases: [
            "Page views register in GA4",
            "Custom events fire on user actions",
            "Performance metrics are collected",
            "Cookie consent blocks tracking until accepted",
          ],
        },
      ],

      prTemplate: `## Description
[Brief description of the feature you implemented]

## Feature Checklist
- [ ] All requirements from the feature spec are met
- [ ] Code follows the project style guide
- [ ] All acceptance criteria are satisfied
- [ ] Tests pass locally
- [ ] No console errors or warnings

## Screenshots/Demo
[Add screenshots or GIF demonstrating the feature]

## Testing Steps
1. [Step-by-step instructions to test your implementation]
2.
3.

## Additional Notes
[Any additional context or notes for reviewers]`,

      requiredChecks: [
        {
          name: "build",
          description: "Next.js production build must succeed",
        },
        {
          name: "lint",
          description: "ESLint must pass with no errors",
        },
        {
          name: "type-check",
          description: "TypeScript must compile without errors",
        },
      ],

      reviewCriteria: [
        {
          category: "Functionality",
          weight: 40,
          criteria: [
            "Feature works as specified",
            "All acceptance criteria are met",
            "Edge cases are handled",
            "No bugs or console errors",
          ],
        },
        {
          category: "Code Quality",
          weight: 30,
          criteria: [
            "Code is clean and readable",
            "Variables and functions have clear names",
            "No unnecessary code duplication",
            "Follows project conventions",
          ],
        },
        {
          category: "Best Practices",
          weight: 20,
          criteria: [
            "Proper error handling",
            "Accessibility considerations (ARIA labels, keyboard navigation)",
            "Performance optimizations",
            "Security best practices",
          ],
        },
        {
          category: "Documentation",
          weight: 10,
          criteria: [
            "Code comments where needed",
            "PR description is clear and complete",
            "README updated if necessary",
          ],
        },
      ],
    },
  });

  console.log(`✅ Created project: ${portfolioProject.title}`);
  console.log(`   Features: ${(portfolioProject.features as any[]).length}`);
}

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed challenges
    // await seedChallenges();

    // Seed Node.js tutorials and category
    await seedNodejsTutorials();

    // Seed phases (HTML-first approach)
    await seedPhases();

    // Seed contribution projects for PR-based system
    await seedContributionProjects();

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
