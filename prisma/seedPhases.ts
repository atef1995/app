import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    }
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

  // Now create phase steps for HTML phase
  console.log("🔗 Creating phase steps for HTML Foundations...");
  
  // Get HTML tutorials
  const htmlTutorials = await prisma.tutorial.findMany({
    include: { category: true },
    where: { category: { slug: "html" } },
    orderBy: { order: "asc" }
  });

  const htmlPhase = await prisma.phase.findUnique({ 
    where: { slug: "html-foundations" } 
  });

  if (htmlPhase && htmlTutorials.length > 0) {
    for (let i = 0; i < htmlTutorials.length; i++) {
      const tutorial = htmlTutorials[i];
      
      await prisma.phaseStep.upsert({
        where: { 
          phaseId_contentType_contentId: {
            phaseId: htmlPhase.id,
            contentType: "tutorial", 
            contentId: tutorial.id
          }
        },
        update: {
          order: i + 1,
          contentSlug: tutorial.slug,
          estimatedHours: tutorial.estimatedTime / 60, // Convert minutes to hours
          prerequisites: i === 0 ? [] : [`tutorial-${htmlTutorials[i-1].slug}`]
        },
        create: {
          phaseId: htmlPhase.id,
          contentType: "tutorial",
          contentId: tutorial.id, 
          contentSlug: tutorial.slug,
          order: i + 1,
          isOptional: false,
          estimatedHours: tutorial.estimatedTime / 60,
          prerequisites: i === 0 ? [] : [`tutorial-${htmlTutorials[i-1].slug}`]
        }
      });
      
      console.log(`  ✅ Added tutorial: ${tutorial.title}`);
    }

    // Add HTML quizzes if they exist
    const htmlQuizzes = await prisma.quiz.findMany({
      include: { tutorial: { include: { category: true } } },
      where: { tutorial: { category: { slug: "html" } } }
    });

    for (const quiz of htmlQuizzes) {
      const tutorialStep = await prisma.phaseStep.findFirst({
        where: {
          phaseId: htmlPhase.id,
          contentId: quiz.tutorialId,
          contentType: "tutorial"
        }
      });

      if (tutorialStep) {
        await prisma.phaseStep.upsert({
          where: {
            phaseId_contentType_contentId: {
              phaseId: htmlPhase.id,
              contentType: "quiz",
              contentId: quiz.id
            }
          },
          update: {
            order: tutorialStep.order + 0.5, // Place quiz right after tutorial
            contentSlug: quiz.slug,
            estimatedHours: 0.5,
            prerequisites: [`tutorial-${quiz.tutorial.slug}`]
          },
          create: {
            phaseId: htmlPhase.id,
            contentType: "quiz",
            contentId: quiz.id,
            contentSlug: quiz.slug,
            order: tutorialStep.order + 0.5,
            isOptional: false,
            estimatedHours: 0.5,
            prerequisites: [`tutorial-${quiz.tutorial.slug}`]
          }
        });
        
        console.log(`  ✅ Added quiz: ${quiz.title}`);
      }
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