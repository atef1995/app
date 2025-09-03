import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabaseContent() {
  console.log("🔍 Checking database content...\n");

  // Check categories
  const categories = await prisma.category.findMany({
    include: {
      tutorials: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  console.log("📚 CATEGORIES:");
  for (const category of categories) {
    console.log(
      `  • ${category.slug} (${category.title}) - ${category.tutorials.length} tutorials`
    );
    if (category.tutorials.length > 0) {
      category.tutorials.slice(0, 3).forEach((tutorial, i) => {
        console.log(`    ${i + 1}. ${tutorial.title}`);
      });
      if (category.tutorials.length > 3) {
        console.log(`    ... and ${category.tutorials.length - 3} more`);
      }
    }
  }

  // Check challenges
  const challenges = await prisma.challenge.findMany({
    orderBy: { order: "asc" },
  });

  console.log(`\n💪 CHALLENGES: ${challenges.length} total`);
  challenges.slice(0, 5).forEach((challenge, i) => {
    console.log(`  ${i + 1}. ${challenge.title} (${challenge.difficulty})`);
  });
  if (challenges.length > 5) {
    console.log(`  ... and ${challenges.length - 5} more`);
  }

  // Check projects
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  console.log(`\n🚀 PROJECTS: ${projects.length} total`);
  projects.slice(0, 5).forEach((project, i) => {
    console.log(`  ${i + 1}. ${project.title} (${project.category})`);
  });
  if (projects.length > 5) {
    console.log(`  ... and ${projects.length - 5} more`);
  }

  // Check quizzes
  const quizzes = await prisma.quiz.findMany({
    include: {
      tutorial: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { title: "asc" },
  });

  console.log(`\n📝 QUIZZES: ${quizzes.length} total`);
  const quizzesByCategory = quizzes.reduce((acc, quiz) => {
    const categorySlug = quiz.tutorial?.category?.slug || "unknown";
    if (!acc[categorySlug]) acc[categorySlug] = [];
    acc[categorySlug].push(quiz);
    return acc;
  }, {} as Record<string, typeof quizzes>);

  for (const [categorySlug, categoryQuizzes] of Object.entries(
    quizzesByCategory
  )) {
    console.log(`  ${categorySlug}: ${categoryQuizzes.length} quizzes`);
  }

  // Check existing phases
  const existingPhases = await prisma.phase.findMany({
    include: {
      phaseSteps: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  console.log(`\n🏗️ EXISTING PHASES: ${existingPhases.length} total`);
  for (const phase of existingPhases) {
    console.log(
      `  • ${phase.slug} (${phase.title}) - ${phase.phaseSteps.length} steps`
    );

    // Group steps by content type
    const stepsByType = phase.phaseSteps.reduce((acc, step) => {
      if (!acc[step.contentType]) acc[step.contentType] = 0;
      acc[step.contentType]++;
      return acc;
    }, {} as Record<string, number>);

    const stepsSummary = Object.entries(stepsByType)
      .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
      .join(", ");

    if (stepsSummary) {
      console.log(`    ${stepsSummary}`);
    }
  }

  console.log("\n✅ Database content check completed!");
}

// Run if called directly
checkDatabaseContent()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { checkDatabaseContent };
