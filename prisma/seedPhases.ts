import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Helper function to populate a phase with tutorials and quizzes from a category
 */
export async function populatePhaseWithContent(
  phaseSlug: string,
  categorySlug: string,
  phaseName: string
) {
  console.log(`🔗 Creating phase steps for ${phaseName}...`);

  const tutorials = await prisma.tutorial.findMany({
    include: { category: true },
    where: { category: { slug: categorySlug } },
    orderBy: { order: "asc" },
  });

  const phase = await prisma.phase.findUnique({
    where: { slug: phaseSlug },
  });

  if (phase && tutorials.length > 0) {
    for (let i = 0; i < tutorials.length; i++) {
      const tutorial = tutorials[i];

      await prisma.phaseStep.upsert({
        where: {
          phaseId_contentType_contentId: {
            phaseId: phase.id,
            contentType: "tutorial",
            contentId: tutorial.id,
          },
        },
        update: {
          order: i + 1,
          contentSlug: tutorial.slug,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites: i === 0 ? [] : [`tutorial-${tutorials[i - 1].slug}`],
        },
        create: {
          phaseId: phase.id,
          contentType: "tutorial",
          contentId: tutorial.id,
          contentSlug: tutorial.slug,
          order: i + 1,
          isOptional: false,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites: i === 0 ? [] : [`tutorial-${tutorials[i - 1].slug}`],
        },
      });

      console.log(
        `  ✅ Added ${categorySlug.toUpperCase()} tutorial: ${tutorial.title}`
      );
    }

    // Add quizzes for this category
    const quizzes = await prisma.quiz.findMany({
      include: { tutorial: { include: { category: true } } },
      where: { tutorial: { category: { slug: categorySlug } } },
    });

    for (const quiz of quizzes) {
      const tutorialStep = await prisma.phaseStep.findFirst({
        where: {
          phaseId: phase.id,
          contentId: quiz.tutorialId,
          contentType: "tutorial",
        },
      });

      if (tutorialStep && quiz.tutorial) {
        await prisma.phaseStep.upsert({
          where: {
            phaseId_contentType_contentId: {
              phaseId: phase.id,
              contentType: "quiz",
              contentId: quiz.id,
            },
          },
          update: {
            order: tutorialStep.order + 0.5,
            contentSlug: quiz.slug,
            estimatedHours: 0.5,
            prerequisites: [`tutorial-${quiz.tutorial.slug}`],
          },
          create: {
            phaseId: phase.id,
            contentType: "quiz",
            contentId: quiz.id,
            contentSlug: quiz.slug,
            order: tutorialStep.order + 0.5,
            isOptional: false,
            estimatedHours: 0.5,
            prerequisites: [`tutorial-${quiz.tutorial.slug}`],
          },
        });

        console.log(
          `  ✅ Added ${categorySlug.toUpperCase()} quiz: ${quiz.title}`
        );
      }
    }
  } else {
    console.log(
      `  ⚠️  No ${categorySlug} content found or phase doesn't exist`
    );
  }
}

export async function seedPhases() {
  console.log("🏗️  Seeding phases...");

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
    {
      slug: "nodejs-fundamentals",
      title: "Node.js Fundamentals",
      description: "Learn server-side JavaScript development with Node.js",
      color: "from-green-400 to-emerald-600",
      icon: "Server",
      order: 9,
      estimatedWeeks: 3,
      prerequisites: ["javascript-fundamentals"],
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

  // Populate phases with content
  await populatePhaseWithContent(
    "html-foundations",
    "html",
    "HTML Foundations"
  );
  await populatePhaseWithContent("css-foundations", "css", "CSS Foundations");

  await populatePhaseWithContent(
    "dom-interactivity",
    "dom",
    "DOM Manipulation & Interactivity"
  );

  // For advanced phases, you might want to handle them differently
  // since they might not have direct category mappings
  console.log("📚 Checking for advanced JavaScript content...");

  // Handle OOP phase with specific content
  const oopPhase = await prisma.phase.findUnique({
    where: { slug: "oop" },
  });
  if (oopPhase) {
    const oopTutorials = await prisma.tutorial.findMany({
      where: {
        OR: [
          { title: { contains: "Object", mode: "insensitive" } },
          { title: { contains: "Class", mode: "insensitive" } },
          { title: { contains: "OOP", mode: "insensitive" } },
          { title: { contains: "Inheritance", mode: "insensitive" } },
          { slug: { contains: "oop" } },
        ],
      },
      orderBy: { order: "asc" },
    });

    console.log(`  Found ${oopTutorials.length} OOP tutorials`);

    for (let i = 0; i < oopTutorials.length; i++) {
      const tutorial = oopTutorials[i];

      await prisma.phaseStep.upsert({
        where: {
          phaseId_contentType_contentId: {
            phaseId: oopPhase.id,
            contentType: "tutorial",
            contentId: tutorial.id,
          },
        },
        update: {
          order: i + 1,
          contentSlug: tutorial.slug,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites:
            i === 0 ? [] : [`tutorial-${oopTutorials[i - 1].slug}`],
        },
        create: {
          phaseId: oopPhase.id,
          contentType: "tutorial",
          contentId: tutorial.id,
          contentSlug: tutorial.slug,
          order: i + 1,
          isOptional: false,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites:
            i === 0 ? [] : [`tutorial-${oopTutorials[i - 1].slug}`],
        },
      });

      console.log(`  ✅ Added OOP tutorial: ${tutorial.title}`);
    }
  }

  // Handle Async phase
  const asyncPhase = await prisma.phase.findUnique({
    where: { slug: "async-programming" },
  });
  if (asyncPhase) {
    const asyncTutorials = await prisma.tutorial.findMany({
      where: {
        OR: [
          { title: { contains: "async", mode: "insensitive" } },
          { title: { contains: "await", mode: "insensitive" } },
          { title: { contains: "Promise", mode: "insensitive" } },
          { title: { contains: "fetch", mode: "insensitive" } },
          { slug: { contains: "async" } },
        ],
      },
      orderBy: { order: "asc" },
    });

    console.log(`  Found ${asyncTutorials.length} Async tutorials`);

    for (let i = 0; i < asyncTutorials.length; i++) {
      const tutorial = asyncTutorials[i];

      await prisma.phaseStep.upsert({
        where: {
          phaseId_contentType_contentId: {
            phaseId: asyncPhase.id,
            contentType: "tutorial",
            contentId: tutorial.id,
          },
        },
        update: {
          order: i + 1,
          contentSlug: tutorial.slug,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites:
            i === 0 ? [] : [`tutorial-${asyncTutorials[i - 1].slug}`],
        },
        create: {
          phaseId: asyncPhase.id,
          contentType: "tutorial",
          contentId: tutorial.id,
          contentSlug: tutorial.slug,
          order: i + 1,
          isOptional: false,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites:
            i === 0 ? [] : [`tutorial-${asyncTutorials[i - 1].slug}`],
        },
      });

      console.log(`  ✅ Added Async tutorial: ${tutorial.title}`);
    }
  }

  // Handle Node.js phase
  const nodejsPhase = await prisma.phase.findUnique({
    where: { slug: "nodejs-fundamentals" },
  });
  if (nodejsPhase) {
    const nodejsTutorials = await prisma.tutorial.findMany({
      where: {
        OR: [
          { title: { contains: "Node", mode: "insensitive" } },
          { title: { contains: "server", mode: "insensitive" } },
          { slug: { contains: "nodejs" } },
          { category: { slug: "nodejs" } },
        ],
      },
      include: { category: true },
      orderBy: { order: "asc" },
    });

    console.log(`  Found ${nodejsTutorials.length} Node.js tutorials`);

    for (let i = 0; i < nodejsTutorials.length; i++) {
      const tutorial = nodejsTutorials[i];

      await prisma.phaseStep.upsert({
        where: {
          phaseId_contentType_contentId: {
            phaseId: nodejsPhase.id,
            contentType: "tutorial",
            contentId: tutorial.id,
          },
        },
        update: {
          order: i + 1,
          contentSlug: tutorial.slug,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites:
            i === 0 ? [] : [`tutorial-${nodejsTutorials[i - 1].slug}`],
        },
        create: {
          phaseId: nodejsPhase.id,
          contentType: "tutorial",
          contentId: tutorial.id,
          contentSlug: tutorial.slug,
          order: i + 1,
          isOptional: false,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites:
            i === 0 ? [] : [`tutorial-${nodejsTutorials[i - 1].slug}`],
        },
      });

      console.log(`  ✅ Added Node.js tutorial: ${tutorial.title}`);
    }
  }

  console.log("✅ Phases seeded successfully!");
}

export async function cleanupPhases() {
  console.log("🧹 Cleaning up phases...");

  await prisma.phaseStep.deleteMany();
  await prisma.phase.deleteMany();

  console.log("✅ Phase cleanup completed!");
}
