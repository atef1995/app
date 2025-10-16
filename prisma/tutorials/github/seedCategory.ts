import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedGithubCategory = async () => {
  // Find or create the GitHub category
  const categoryRecord = await prisma.category.upsert({
    where: { slug: "github" },
    update: {},
    create: {
      title: "GitHub & Version Control",
      description:
        "Master Git and GitHub for version control and collaboration",
      slug: "github",
      order: 6, // Position after existing categories
      published: true,
      difficulty: "beginner",
      topics: ["Github", "version control"],
      duration: "6-8 hours",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
      badgeBg: "bg-purple-100 dark:bg-purple-900",
      badgeColor: "text-purple-800 dark:text-purple-200",
      dotColor: "bg-purple-600",
    },
  });

  console.log(`✅ Category created: ${categoryRecord.title}`);
  return categoryRecord;
};

seedGithubCategory()
  .then(() => console.log("success"))
  .catch((e) => console.log(e));

export { seedGithubCategory };
