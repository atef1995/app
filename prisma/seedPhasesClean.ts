import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Clean phase seeding with strict category mapping only
 */
async function seedPhasesClean() {
  console.log("🏗️  Seeding phases with strict category mapping...");

  // Phase data based on logical learning progression
  const phases = [
    {
      slug: "html-foundations",
      title: "HTML Foundations",
      description: "Learn the building blocks of web development with HTML",
      color: "from-orange-400 to-red-500",
      icon: "Globe",
      order: 1,
      estimatedWeeks: 2,
      prerequisites: [],
      published: true,
    },
    {
      slug: "css-foundations",
      title: "CSS Foundations",
      description: "Style and layout your web pages with CSS",
      color: "from-blue-400 to-purple-500",
      icon: "Palette",
      order: 2,
      estimatedWeeks: 3,
      prerequisites: ["html-foundations"],
      published: true,
    },
    {
      slug: "javascript-fundamentals",
      title: "JavaScript Fundamentals",
      description: "Master the core concepts and syntax of JavaScript",
      color: "from-green-400 to-blue-500",
      icon: "Sprout",
      order: 3,
      estimatedWeeks: 4,
      prerequisites: ["html-foundations", "css-foundations"],
      published: true,
    },
    {
      slug: "dom-interactivity",
      title: "DOM Manipulation & Interactivity",
      description: "Learn to make web pages interactive and dynamic",
      color: "from-purple-400 to-pink-500",
      icon: "MousePointer",
      order: 4,
      estimatedWeeks: 3,
      prerequisites: ["javascript-fundamentals"],
      published: true,
    },
    {
      slug: "oop-concepts",
      title: "Object-Oriented Programming",
      description: "Master classes, inheritance, and OOP principles",
      color: "from-orange-400 to-red-500",
      icon: "Building",
      order: 5,
      estimatedWeeks: 3,
      prerequisites: ["javascript-fundamentals"],
      published: true,
    },
    {
      slug: "async-programming",
      title: "Asynchronous JavaScript",
      description: "Master promises, async/await, and API integration",
      color: "from-yellow-400 to-orange-500",
      icon: "Zap",
      order: 6,
      estimatedWeeks: 4,
      prerequisites: ["oop-concepts"],
      published: true,
    },
    {
      slug: "advanced-concepts",
      title: "Advanced JavaScript",
      description: "Deep dive into advanced concepts and patterns",
      color: "from-red-400 to-purple-600",
      icon: "Flame",
      order: 7,
      estimatedWeeks: 5,
      prerequisites: ["async-programming"],
      published: true,
    },
    {
      slug: "data-structures",
      title: "Data Structures & Algorithms",
      description: "Master computer science fundamentals",
      color: "from-blue-400 to-indigo-600",
      icon: "Database",
      order: 8,
      estimatedWeeks: 4,
      prerequisites: ["advanced-concepts"],
      published: true,
    },
  ];

  // Create phases
  for (const phase of phases) {
    await prisma.phase.upsert({
      where: { slug: phase.slug },
      update: phase,
      create: phase,
    });
    console.log(`✅ Phase: ${phase.title}`);
  }

  // Strict phase-to-category mapping based on what we discovered
  const phaseContentMapping = {
    "html-foundations": {
      categories: ["html"],
      includeProjects: false,
      includeChallenges: false,
    },
    "css-foundations": {
      categories: ["css"],
      includeProjects: false,
      includeChallenges: false,
    },
    "javascript-fundamentals": {
      categories: ["fundamentals"],
      includeProjects: true,
      includeChallenges: true,
    },
    "dom-interactivity": {
      categories: ["dom"],
      includeProjects: true,
      includeChallenges: true,
    },
    "oop-concepts": {
      categories: ["oop"],
      includeProjects: true,
      includeChallenges: true,
    },
    "async-programming": {
      categories: ["async"],
      includeProjects: true,
      includeChallenges: true,
    },
    "advanced-concepts": {
      categories: ["advanced"],
      includeProjects: true,
      includeChallenges: true,
    },
    "data-structures": {
      categories: ["data-structures"],
      includeProjects: true,
      includeChallenges: true,
    },
    "backend-development": {
      categories: ["nodejs"],
      includeProjects: true,
      includeChallenges: true,
    },
  };

  // Get all content
  const categories = await prisma.category.findMany({
    include: {
      tutorials: {
        orderBy: { order: "asc" },
      },
    },
  });

  const quizzes = await prisma.quiz.findMany({
    include: {
      tutorial: {
        include: {
          category: true,
        },
      },
    },
  });

  const challenges = await prisma.challenge.findMany({
    orderBy: { order: "asc" },
  });

  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  console.log(
    `\nFound ${categories.length} categories, ${challenges.length} challenges, ${projects.length} projects, ${quizzes.length} quizzes`
  );

  // Get all phases
  const createdPhases = await prisma.phase.findMany({
    orderBy: { order: "asc" },
  });

  // Populate each phase with content
  for (const phase of createdPhases) {
    console.log(`\n🔗 Populating phase: ${phase.title}`);

    const mapping =
      phaseContentMapping[phase.slug as keyof typeof phaseContentMapping];
    if (!mapping) {
      console.log(`  ⚠️  No mapping found for phase: ${phase.slug}`);
      continue;
    }

    let stepOrder = 1;

    // Add tutorials from specific categories with their quizzes immediately following
    for (const categorySlug of mapping.categories) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category && category.tutorials.length > 0) {
        console.log(
          `  📚 Adding tutorials from category: ${category.title} (${category.tutorials.length} tutorials)`
        );

        // Get all quizzes for this category upfront
        const categoryQuizzes = quizzes.filter(
          (quiz) => quiz.tutorial?.category?.slug === categorySlug
        );

        for (let i = 0; i < category.tutorials.length; i++) {
          const tutorial = category.tutorials[i];

          // Add the tutorial first
          await prisma.phaseStep.upsert({
            where: {
              phaseId_contentType_contentId: {
                phaseId: phase.id,
                contentType: "tutorial",
                contentId: tutorial.id,
              },
            },
            update: {
              order: stepOrder,
              contentSlug: tutorial.slug,
              estimatedHours: tutorial.estimatedTime / 60,
              prerequisites:
                i === 0 ? [] : [`tutorial-${category.tutorials[i - 1].slug}`],
            },
            create: {
              phaseId: phase.id,
              contentType: "tutorial",
              contentId: tutorial.id,
              contentSlug: tutorial.slug,
              order: stepOrder,
              isOptional: false,
              estimatedHours: tutorial.estimatedTime / 60,
              prerequisites:
                i === 0 ? [] : [`tutorial-${category.tutorials[i - 1].slug}`],
            },
          });

          console.log(`    ✅ ${tutorial.title}`);
          stepOrder += 1;

          // Immediately add the corresponding quiz for this tutorial (if it exists)
          const correspondingQuiz = categoryQuizzes.find(
            (quiz) => quiz.tutorial?.id === tutorial.id
          );

          if (correspondingQuiz && correspondingQuiz.tutorial) {
            await prisma.phaseStep.upsert({
              where: {
                phaseId_contentType_contentId: {
                  phaseId: phase.id,
                  contentType: "quiz",
                  contentId: correspondingQuiz.id,
                },
              },
              update: {
                order: stepOrder,
                contentSlug: correspondingQuiz.slug,
                estimatedHours: 0.5,
                prerequisites: [`tutorial-${correspondingQuiz.tutorial.slug}`],
              },
              create: {
                phaseId: phase.id,
                contentType: "quiz",
                contentId: correspondingQuiz.id,
                contentSlug: correspondingQuiz.slug,
                order: stepOrder,
                isOptional: false,
                estimatedHours: 0.5,
                prerequisites: [`tutorial-${correspondingQuiz.tutorial.slug}`],
              },
            });

            console.log(
              `    ✅ Quiz: ${correspondingQuiz.title} (follows ${tutorial.title})`
            );
            stepOrder += 1;
          }
        }
      }
    }

    // Add relevant projects
    if (mapping.includeProjects) {
      const relevantProjects = projects.filter((project) =>
        mapping.categories.includes(project.category)
      );

      if (relevantProjects.length > 0) {
        console.log(
          `  🚀 Adding projects for phase (${relevantProjects.length} projects)`
        );

        for (const project of relevantProjects) {
          await prisma.phaseStep.upsert({
            where: {
              phaseId_contentType_contentId: {
                phaseId: phase.id,
                contentType: "project",
                contentId: project.id,
              },
            },
            update: {
              order: stepOrder,
              contentSlug: project.slug,
              estimatedHours: project.estimatedHours || 2.0,
              prerequisites: [],
            },
            create: {
              phaseId: phase.id,
              contentType: "project",
              contentId: project.id,
              contentSlug: project.slug,
              order: stepOrder,
              isOptional: true,
              estimatedHours: project.estimatedHours || 2.0,
              prerequisites: [],
            },
          });

          console.log(`    ✅ Project: ${project.title}`);
          stepOrder += 1;
        }
      }
    }

    // Add relevant challenges (only basic ones for fundamentals phases)
    if (mapping.includeChallenges) {
      // For fundamentals, only include easy challenges
      // For advanced phases, include medium/hard challenges
      let relevantChallenges = challenges;

      if (phase.slug === "javascript-fundamentals") {
        relevantChallenges = challenges
          .filter((c) => c.difficulty === "EASY")
          .slice(0, 5);
      } else if (phase.slug === "dom-interactivity") {
        relevantChallenges = challenges
          .filter((c) => c.difficulty === "MEDIUM")
          .slice(0, 3);
      } else if (phase.slug === "oop-concepts") {
        relevantChallenges = challenges
          .filter((c) => c.difficulty === "MEDIUM")
          .slice(0, 3);
      } else if (phase.slug === "async-programming") {
        relevantChallenges = challenges
          .filter((c) => c.difficulty === "HARD")
          .slice(0, 2);
      } else if (phase.slug === "advanced-concepts") {
        relevantChallenges = challenges
          .filter((c) => c.difficulty === "HARD")
          .slice(0, 3);
      } else if (phase.slug === "data-structures") {
        relevantChallenges = challenges
          .filter((c) => c.difficulty === "HARD")
          .slice(0, 5);
      } else {
        relevantChallenges = [];
      }

      if (relevantChallenges.length > 0) {
        console.log(
          `  💪 Adding challenges for phase (${relevantChallenges.length} challenges)`
        );

        for (const challenge of relevantChallenges) {
          await prisma.phaseStep.upsert({
            where: {
              phaseId_contentType_contentId: {
                phaseId: phase.id,
                contentType: "challenge",
                contentId: challenge.id,
              },
            },
            update: {
              order: stepOrder,
              contentSlug: challenge.slug,
              estimatedHours: 1.0,
              prerequisites: [],
            },
            create: {
              phaseId: phase.id,
              contentType: "challenge",
              contentId: challenge.id,
              contentSlug: challenge.slug,
              order: stepOrder,
              isOptional: true,
              estimatedHours: 1.0,
              prerequisites: [],
            },
          });

          console.log(
            `    ✅ Challenge: ${challenge.title} (${challenge.difficulty})`
          );
          stepOrder += 1;
        }
      }
    }

    const totalSteps = stepOrder - 1;
    console.log(`  ✅ Phase completed with ${totalSteps} steps`);
  }

  console.log("✅ Phases seeded successfully with clean category mapping!");
}

export async function cleanupPhases() {
  console.log("🧹 Cleaning up phases...");

  await prisma.phaseStep.deleteMany();
  await prisma.phase.deleteMany();

  console.log("✅ Phase cleanup completed!");
}

// Main function that clears and re-seeds everything
export async function reseedPhasesClean() {
  console.log(
    "🔄 Clearing existing phases and re-seeding with clean mapping..."
  );

  // Clear existing phase steps and phases
  await cleanupPhases();

  // Re-seed everything
  await seedPhasesClean();
}

// Run if called directly
reseedPhasesClean()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
