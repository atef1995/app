import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONTRIBUTION_CATEGORY = {
  slug: "contribution-projects",
  title: "Project Contributions",
  description:
    "Learn by contributing to real-world projects. Each tutorial guides you through implementing features in our template repositories.",
  difficulty: "intermediate",
  topics: [
    "GitHub",
    "Pull Requests",
    "Code Reviews",
    "Best Practices",
    "Project Development",
  ],
  duration: "varies",
  iconBg: "bg-purple-100 dark:bg-purple-900",
  iconColor: "text-purple-600 dark:text-purple-400",
  badgeBg: "bg-purple-100 dark:bg-purple-900",
  badgeColor: "text-purple-800 dark:text-purple-200",
  dotColor: "bg-purple-600",
  order: 9, // After advanced tutorials
};

// Tutorials for each contribution project
const CONTRIBUTION_TUTORIALS = [
  {
    slug: "portfolio-site-dark-mode",
    title: "Implementing Dark Mode in Portfolio Site",
    description:
      "Learn how to implement a dynamic dark mode toggle in the portfolio site template using Next.js and Tailwind CSS.",
    content: null, // Will be loaded from MDX file
    mdxFile: "portfolio-site/dark-mode.mdx",
    difficulty: 2,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 180, // 3 hours
  },
  {
    slug: "portfolio-site-contact-form",
    title: "Building a Contact Form with Email Integration",
    description:
      "Create a fully functional contact form with validation and email service integration using React Hook Form and SendGrid.",
    content: null,
    mdxFile: "portfolio-site/contact-form.mdx",
    difficulty: 2,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 240, // 4 hours
  },
  {
    slug: "portfolio-site-blog-mdx",
    title: "Creating a Blog with MDX Support",
    description:
      "Implement a blog section that renders content from MDX files with syntax highlighting and reading time estimation.",
    content: null,
    mdxFile: "portfolio-site/blog-section.mdx",
    difficulty: 3,
    order: 3,
    published: true,
    isPremium: true,
    requiredPlan: "PRO",
    estimatedTime: 360, // 6 hours
  },
  {
    slug: "portfolio-site-admin-dashboard",
    title: "Building an Admin Dashboard",
    description:
      "Create a protected admin dashboard with analytics charts and content management capabilities.",
    content: null,
    mdxFile: "portfolio-site/admin-dashboard.mdx",
    difficulty: 4,
    order: 4,
    published: true,
    isPremium: true,
    requiredPlan: "PRO",
    estimatedTime: 480, // 8 hours
  },
  {
    slug: "portfolio-site-analytics",
    title: "Integrating Analytics and Performance Monitoring",
    description:
      "Add Google Analytics 4 and performance monitoring with Web Vitals to your portfolio site.",
    content: null,
    mdxFile: "portfolio-site/analytics.mdx",
    difficulty: 3,
    order: 5,
    published: true,
    isPremium: true,
    requiredPlan: "PRO",
    estimatedTime: 300, // 5 hours
  },
];

async function seedContributionTutorials() {
  try {
    console.log("🌱 Starting contribution tutorials seeding...");

    // Create the contribution projects category
    const category = await prisma.category.upsert({
      where: { slug: CONTRIBUTION_CATEGORY.slug },
      update: CONTRIBUTION_CATEGORY,
      create: CONTRIBUTION_CATEGORY,
    });

    console.log(`✅ Created category: ${category.title}`);

    // Create tutorials for this category
    for (const tutorialData of CONTRIBUTION_TUTORIALS) {
      const tutorial = await prisma.tutorial.upsert({
        where: { slug: tutorialData.slug },
        update: {
          ...tutorialData,
          categoryId: category.id,
        },
        create: {
          ...tutorialData,
          categoryId: category.id,
        },
      });

      console.log(`✅ Created tutorial: ${tutorial.title}`);
    }

    console.log("🎉 Contribution tutorials seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total tutorials: ${CONTRIBUTION_TUTORIALS.length}`);
    console.log(
      `   - Free tutorials: ${
        CONTRIBUTION_TUTORIALS.filter((t) => !t.isPremium).length
      }`
    );
    console.log(
      `   - Premium tutorials: ${
        CONTRIBUTION_TUTORIALS.filter((t) => t.isPremium).length
      }`
    );
  } catch (error) {
    console.error("❌ Error seeding contribution tutorials:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedContributionTutorials()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export {
  seedContributionTutorials,
  CONTRIBUTION_CATEGORY,
  CONTRIBUTION_TUTORIALS,
};
