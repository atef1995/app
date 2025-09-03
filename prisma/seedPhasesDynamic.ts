import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Dynamically populate phases with content based on what exists in the database
 */
async function populatePhasesDynamically() {
  console.log("🔍 Discovering available content in database...");

  // Get all categories with their content
  const categories = await prisma.category.findMany({
    include: {
      tutorials: {
        orderBy: { order: "asc" },
      },
    },
  });

  // Get all challenges
  const challenges = await prisma.challenge.findMany({
    orderBy: { difficulty: "asc" },
  });

  // Get all projects
  const projects = await prisma.project.findMany({
    orderBy: { difficulty: "asc" },
  });

  // Get all quizzes with their tutorial relationships
  const quizzes = await prisma.quiz.findMany({
    include: {
      tutorial: {
        include: {
          category: true,
        },
      },
    },
  });

  console.log(
    `Found ${categories.length} categories, ${challenges.length} challenges, ${projects.length} projects, ${quizzes.length} quizzes`
  );

  // Define phase-to-content mapping dynamically based on phase slug and available content
  const phaseContentMapping = new Map<
    string,
    {
      categories: string[];
      keywords: string[];
      contentTypes: string[];
    }
  >();

  // Strict mapping - only use categories, avoid broad keyword matching
  phaseContentMapping.set("html-foundations", {
    categories: ["html"],
    keywords: [], // No keyword matching for HTML - category is enough
    contentTypes: ["tutorial", "quiz"],
  });

  phaseContentMapping.set("css-foundations", {
    categories: ["css"],
    keywords: [], // No keyword matching for CSS - category is enough
    contentTypes: ["tutorial", "quiz"],
  });

  phaseContentMapping.set("javascript-fundamentals", {
    categories: ["javascript"],
    keywords: [], // No keyword matching for JS - category is enough
    contentTypes: ["tutorial", "quiz", "challenge"],
  });

  phaseContentMapping.set("dom-interactivity", {
    categories: ["dom"],
    keywords: [], // No keyword matching for DOM - category is enough
    contentTypes: ["tutorial", "quiz", "challenge"],
  });

  phaseContentMapping.set("oop-concepts", {
    categories: ["javascript-oop"], // Try specific OOP category first
    keywords: [
      "object-oriented",
      "class constructor",
      "inheritance extends",
      "polymorphism override",
      "encapsulation private",
      "abstraction interface",
    ], // Use more specific multi-word keywords
    contentTypes: ["tutorial", "quiz", "challenge"],
  });

  phaseContentMapping.set("async-programming", {
    categories: ["javascript-async"], // Try specific async category first
    keywords: [
      "asynchronous javascript",
      "async await",
      "promise then",
      "fetch api",
      "callback function",
      "xhr request",
    ], // Use more specific multi-word keywords
    contentTypes: ["tutorial", "quiz", "challenge"],
  });

  phaseContentMapping.set("advanced-concepts", {
    categories: ["javascript-advanced"], // Try specific advanced category first
    keywords: [
      "advanced javascript",
      "closure scope",
      "prototype chain",
      "design pattern",
      "javascript optimization",
    ], // Use more specific multi-word keywords
    contentTypes: ["tutorial", "quiz", "challenge", "project"],
  });

  phaseContentMapping.set("data-structures", {
    categories: ["algorithms", "data-structures"], // Try specific categories first
    keywords: [
      "data structure algorithm",
      "linked list implementation",
      "binary tree",
      "graph traversal",
      "hash table",
    ], // Use more specific multi-word keywords
    contentTypes: ["tutorial", "quiz", "challenge", "project"],
  });

  // Get all phases
  const phases = await prisma.phase.findMany({
    orderBy: { order: "asc" },
  });

  // Populate each phase dynamically
  for (const phase of phases) {
    console.log(`\n🔗 Populating phase: ${phase.title}`);

    const mapping = phaseContentMapping.get(phase.slug);
    if (!mapping) {
      console.log(`  ⚠️  No mapping found for phase: ${phase.slug}`);
      continue;
    }

    let stepOrder = 1;
    const addedContent: string[] = [];

    // Add tutorials from specific categories first
    for (const categorySlug of mapping.categories) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category && category.tutorials.length > 0) {
        console.log(
          `  📚 Adding tutorials from category: ${category.title} (${category.tutorials.length} tutorials)`
        );

        for (let i = 0; i < category.tutorials.length; i++) {
          const tutorial = category.tutorials[i];

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

          addedContent.push(`tutorial-${tutorial.slug}`);
          stepOrder += 1;
          console.log(`    ✅ ${tutorial.title}`);
        }

        // Add quizzes for this category right after tutorials
        const categoryQuizzes = quizzes.filter(
          (quiz) => quiz.tutorial?.category?.slug === categorySlug
        );

        for (const quiz of categoryQuizzes) {
          if (!quiz.tutorial) continue;

          await prisma.phaseStep.upsert({
            where: {
              phaseId_contentType_contentId: {
                phaseId: phase.id,
                contentType: "quiz",
                contentId: quiz.id,
              },
            },
            update: {
              order: stepOrder,
              contentSlug: quiz.slug,
              estimatedHours: 0.5,
              prerequisites: [`tutorial-${quiz.tutorial.slug}`],
            },
            create: {
              phaseId: phase.id,
              contentType: "quiz",
              contentId: quiz.id,
              contentSlug: quiz.slug,
              order: stepOrder,
              isOptional: false,
              estimatedHours: 0.5,
              prerequisites: [`tutorial-${quiz.tutorial.slug}`],
            },
          });

          console.log(`    ✅ Quiz: ${quiz.title}`);
          stepOrder += 1;
        }
      }
    }

    // Only add tutorials by keyword matching if no categories were specified AND keywords exist
    if (mapping.categories.length === 0 && mapping.keywords.length > 0) {
      console.log(
        `  🔍 Searching for tutorials by keywords: ${mapping.keywords.join(
          ", "
        )}`
      );

      const allTutorials = await prisma.tutorial.findMany({
        include: { category: true },
        orderBy: [{ category: { slug: "asc" } }, { order: "asc" }],
      });

      const matchingTutorials = allTutorials.filter((tutorial) => {
        // Skip if already added from category
        if (addedContent.includes(`tutorial-${tutorial.slug}`)) return false;

        // Only match if tutorial is NOT in a category we've already processed
        const tutorialCategorySlug = tutorial.category?.slug;
        if (tutorialCategorySlug && mapping.categories.includes(tutorialCategorySlug)) {
          return false; // Already handled by category
        }

        const text = `${tutorial.title} ${tutorial.description || ""} ${
          tutorial.slug
        }`.toLowerCase();
        
        // Use more strict matching - require multi-word keywords to match completely
        return mapping.keywords.some((keyword) => {
          const keywordLower = keyword.toLowerCase();
          // For multi-word keywords, require all words to be present
          if (keywordLower.includes(' ')) {
            const words = keywordLower.split(' ');
            return words.every(word => text.includes(word));
          }
          // For single words, use exact matching with word boundaries when possible
          return text.includes(keywordLower);
        });
      });

      if (matchingTutorials.length > 0) {
        console.log(`    Found ${matchingTutorials.length} matching tutorials`);

        for (let i = 0; i < matchingTutorials.length; i++) {
          const tutorial = matchingTutorials[i];

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
              prerequisites: [],
            },
            create: {
              phaseId: phase.id,
              contentType: "tutorial",
              contentId: tutorial.id,
              contentSlug: tutorial.slug,
              order: stepOrder,
              isOptional: false,
              estimatedHours: tutorial.estimatedTime / 60,
              prerequisites: [],
            },
          });

          addedContent.push(`tutorial-${tutorial.slug}`);
          stepOrder += 1;

          const matchedKeyword = mapping.keywords.find(
            (k) =>
              tutorial.title.toLowerCase().includes(k.toLowerCase()) ||
              tutorial.slug.toLowerCase().includes(k.toLowerCase())
          );
          console.log(
            `    ✅ ${tutorial.title} (matched: "${matchedKeyword}")`
          );
        }

        // Add quizzes for keyword-matched tutorials
        const keywordQuizzes = quizzes.filter((quiz) => {
          if (!quiz.tutorial) return false;
          return matchingTutorials.some((t) => t.id === quiz.tutorial!.id);
        });

        for (const quiz of keywordQuizzes) {
          if (!quiz.tutorial) continue;

          await prisma.phaseStep.upsert({
            where: {
              phaseId_contentType_contentId: {
                phaseId: phase.id,
                contentType: "quiz",
                contentId: quiz.id,
              },
            },
            update: {
              order: stepOrder,
              contentSlug: quiz.slug,
              estimatedHours: 0.5,
              prerequisites: [`tutorial-${quiz.tutorial.slug}`],
            },
            create: {
              phaseId: phase.id,
              contentType: "quiz",
              contentId: quiz.id,
              contentSlug: quiz.slug,
              order: stepOrder,
              isOptional: false,
              estimatedHours: 0.5,
              prerequisites: [`tutorial-${quiz.tutorial.slug}`],
            },
          });

          console.log(`    ✅ Quiz: ${quiz.title}`);
          stepOrder += 1;
        }
      }
    }

    // Add challenges that match the phase
    if (mapping.contentTypes.includes("challenge") && challenges.length > 0) {
      console.log(`  💪 Searching for matching challenges...`);

      const matchingChallenges = challenges.filter((challenge) => {
        const text = `${challenge.title} ${challenge.description || ""} ${
          challenge.slug
        }`.toLowerCase();
        return mapping.keywords.some((keyword) =>
          text.includes(keyword.toLowerCase())
        );
      });

      if (matchingChallenges.length > 0) {
        console.log(
          `    Found ${matchingChallenges.length} matching challenges`
        );

        for (const challenge of matchingChallenges) {
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

          const matchedKeyword = mapping.keywords.find(
            (k) =>
              challenge.title.toLowerCase().includes(k.toLowerCase()) ||
              challenge.slug.toLowerCase().includes(k.toLowerCase())
          );
          console.log(
            `    ✅ ${challenge.title} (matched: "${matchedKeyword}")`
          );
          stepOrder += 1;
        }
      }
    }

    // Add projects that match the phase
    if (mapping.contentTypes.includes("project") && projects.length > 0) {
      console.log(`  🚀 Searching for matching projects...`);

      const matchingProjects = projects.filter((project) => {
        const text = `${project.title} ${project.description || ""} ${
          project.slug
        }`.toLowerCase();
        return mapping.keywords.some((keyword) =>
          text.includes(keyword.toLowerCase())
        );
      });

      if (matchingProjects.length > 0) {
        console.log(`    Found ${matchingProjects.length} matching projects`);

        for (const project of matchingProjects) {
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

          const matchedKeyword = mapping.keywords.find(
            (k) =>
              project.title.toLowerCase().includes(k.toLowerCase()) ||
              project.slug.toLowerCase().includes(k.toLowerCase())
          );
          console.log(`    ✅ ${project.title} (matched: "${matchedKeyword}")`);
          stepOrder += 1;
        }
      }
    }

    const totalSteps = stepOrder - 1;
    console.log(`  ✅ Phase completed with ${totalSteps} steps`);

    if (totalSteps === 0) {
      console.log(`  ⚠️  Warning: Phase "${
        phase.title
      }" has no content! You may need to:
      - Add tutorials/quizzes with matching keywords: ${mapping.keywords.join(
        ", "
      )}
      - Add content to categories: ${mapping.categories.join(", ")}
      - Run content seeding scripts first`);
    }
  }
}

export async function seedPhasesDynamic() {
  console.log("🏗️  Seeding phases dynamically...");

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

  // Populate all phases dynamically based on existing database content
  await populatePhasesDynamically();

  console.log("✅ Phases seeded successfully with dynamic content detection!");
}

export async function cleanupPhases() {
  console.log("🧹 Cleaning up phases...");

  await prisma.phaseStep.deleteMany();
  await prisma.phase.deleteMany();

  console.log("✅ Phase cleanup completed!");
}

// Main function that clears and re-seeds everything
export async function reseedPhasesDynamic() {
  console.log("🔄 Clearing existing phases and re-seeding...");
  
  // Clear existing phase steps and phases
  await cleanupPhases();
  
  // Re-seed everything
  await seedPhasesDynamic();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  reseedPhasesDynamic()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
