import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateTutorialStructure() {
  try {
    console.log("🔄 Starting tutorial structure update...");

    // 1. Update the existing functions-and-scope tutorial to be a redirect
    console.log("📝 Updating redirect tutorial...");
    await prisma.tutorial.upsert({
      where: { slug: "functions-and-scope" },
      update: {
        title: "Functions and Scope in JavaScript",
        description: "This tutorial has been split into two focused lessons for better learning",
        mdxFile: "02-functions-and-scope",
        difficulty: 1,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      create: {
        id: "2",
        slug: "functions-and-scope", 
        title: "Functions and Scope in JavaScript",
        description: "This tutorial has been split into two focused lessons for better learning",
        mdxFile: "02-functions-and-scope",
        difficulty: 1,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    // 2. Update or create the redirect tutorial's quiz to have 0 questions
    console.log("📝 Updating redirect tutorial quiz...");
    const redirectTutorial = await prisma.tutorial.findUnique({
      where: { slug: "functions-and-scope" },
      include: { quizzes: true }
    });

    if (redirectTutorial && redirectTutorial.quizzes.length > 0) {
      // Update existing quiz to have 0 questions
      await prisma.quiz.update({
        where: { id: redirectTutorial.quizzes[0].id },
        data: {
          title: "Navigation Quiz",
          questions: [], // Empty questions array
        },
      });
    } else if (redirectTutorial) {
      // Create a new empty quiz
      await prisma.quiz.create({
        data: {
          tutorialId: redirectTutorial.id,
          title: "Navigation Quiz",
          questions: [], // Empty questions array
        },
      });
    }

    // 3. Create the new Functions Fundamentals tutorial
    console.log("📚 Creating Functions Fundamentals tutorial...");
    await prisma.tutorial.upsert({
      where: { slug: "functions-fundamentals" },
      update: {
        title: "JavaScript Functions Fundamentals",
        description: "Learn the essential concepts of JavaScript functions",
        mdxFile: "02-functions-fundamentals",
        difficulty: 1,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      create: {
        slug: "functions-fundamentals",
        title: "JavaScript Functions Fundamentals",
        description: "Learn the essential concepts of JavaScript functions",
        mdxFile: "02-functions-fundamentals",
        difficulty: 1,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    // 4. Create quiz for Functions Fundamentals
    console.log("🧠 Creating Functions Fundamentals quiz...");
    const fundamentalsTutorial = await prisma.tutorial.findUnique({
      where: { slug: "functions-fundamentals" },
      include: { quizzes: true }
    });

    if (fundamentalsTutorial && fundamentalsTutorial.quizzes.length === 0) {
      await prisma.quiz.create({
        data: {
          tutorialId: fundamentalsTutorial.id,
          title: "Functions Fundamentals Quiz",
          questions: [
            {
              question: "What is the primary purpose of functions in JavaScript?",
              options: [
                "To make code look professional",
                "To create reusable blocks of code",
                "To slow down execution",
                "To make debugging harder"
              ],
              correct: 1,
              explanation: "Functions allow you to create reusable blocks of code that can be called multiple times, making your code more organized and maintainable.",
              difficulty: "easy",
            },
            {
              question: "Which of the following is a function declaration?",
              options: [
                "const myFunc = function() {}",
                "function myFunc() {}",
                "let myFunc = () => {}",
                "var myFunc = new Function()"
              ],
              correct: 1,
              explanation: "Function declarations use the 'function' keyword followed by the function name, and they are hoisted.",
              difficulty: "easy",
            },
            {
              question: "What will this code output? function greet(name = 'World') { return 'Hello ' + name; } console.log(greet());",
              options: [
                "Hello undefined",
                "Hello World",
                "Error",
                "Hello null"
              ],
              correct: 1,
              explanation: "When no argument is passed, the default parameter value 'World' is used.",
              difficulty: "medium",
            },
            {
              question: "How do you call a function named 'calculateArea' with parameters 5 and 10?",
              options: [
                "calculateArea[5, 10]",
                "calculateArea(5, 10)",
                "calculateArea{5, 10}",
                "call calculateArea(5, 10)"
              ],
              correct: 1,
              explanation: "Functions are called using parentheses with comma-separated arguments.",
              difficulty: "easy",
            },
            {
              question: "What does a function return if no return statement is specified?",
              options: [
                "null",
                "0",
                "undefined",
                "false"
              ],
              correct: 2,
              explanation: "Functions without explicit return statements return 'undefined' by default.",
              difficulty: "medium",
            }
          ],
        },
      });
    }

    // 5. Create the new Advanced Functions & Scope tutorial
    console.log("🚀 Creating Advanced Functions & Scope tutorial...");
    await prisma.tutorial.upsert({
      where: { slug: "advanced-functions-scope" },
      update: {
        title: "Advanced Functions & Scope in JavaScript",
        description: "Master advanced function concepts, scope, and closures",
        mdxFile: "03-advanced-functions-scope",
        difficulty: 2,
        order: 3,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
      create: {
        slug: "advanced-functions-scope",
        title: "Advanced Functions & Scope in JavaScript", 
        description: "Master advanced function concepts, scope, and closures",
        mdxFile: "03-advanced-functions-scope",
        difficulty: 2,
        order: 3,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    // 6. Create quiz for Advanced Functions & Scope
    console.log("🧠 Creating Advanced Functions & Scope quiz...");
    const advancedTutorial = await prisma.tutorial.findUnique({
      where: { slug: "advanced-functions-scope" },
      include: { quizzes: true }
    });

    if (advancedTutorial && advancedTutorial.quizzes.length === 0) {
      await prisma.quiz.create({
        data: {
          tutorialId: advancedTutorial.id,
          title: "Advanced Functions & Scope Quiz",
          questions: [
            {
              question: "What is a closure in JavaScript?",
              options: [
                "A way to close functions",
                "A function that has access to variables in its outer scope",
                "A function without parameters",
                "A function that doesn't return anything"
              ],
              correct: 1,
              explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has finished executing.",
              difficulty: "medium",
            },
            {
              question: "What's the main difference between arrow functions and regular functions regarding 'this'?",
              options: [
                "No difference",
                "Arrow functions don't have their own 'this'",
                "Regular functions don't have 'this'",
                "Arrow functions always refer to window"
              ],
              correct: 1,
              explanation: "Arrow functions don't have their own 'this' context; they inherit 'this' from the enclosing scope.",
              difficulty: "medium",
            },
            {
              question: "Which of the following creates an anonymous function?",
              options: [
                "function myFunc() {}",
                "const myFunc = function() {}",
                "[1,2,3].map(function(x) { return x * 2; })",
                "function namedFunc() { return 'named'; }"
              ],
              correct: 2,
              explanation: "The function passed to map() has no name, making it an anonymous function.",
              difficulty: "medium",
            },
            {
              question: "What will this code output? let x = 'global'; function outer() { let x = 'outer'; function inner() { console.log(x); } return inner; } outer()();",
              options: [
                "global",
                "outer", 
                "undefined",
                "Error"
              ],
              correct: 1,
              explanation: "The inner function has access to the outer function's variable 'x' due to closure, so it logs 'outer'.",
              difficulty: "hard",
            },
            {
              question: "What is the result of: const add = (a) => (b) => a + b; const add5 = add(5); add5(3);",
              options: [
                "8",
                "53",
                "undefined",
                "Error"
              ],
              correct: 0,
              explanation: "This is function currying. add(5) returns a function that adds 5 to its argument, so add5(3) returns 5 + 3 = 8.",
              difficulty: "hard",
            }
          ],
        },
      });
    }

    // 7. Update the order of the arrays-and-objects tutorial to 4
    console.log("📝 Updating Arrays and Objects tutorial order...");
    await prisma.tutorial.updateMany({
      where: { slug: "arrays-and-objects" },
      data: { order: 4 },
    });

    console.log("✅ Tutorial structure update completed successfully!");
    
    // 8. Display current tutorial structure
    console.log("\n📋 Current tutorial structure:");
    const tutorials = await prisma.tutorial.findMany({
      orderBy: { order: 'asc' },
      include: { quizzes: true },
    });

    tutorials.forEach((tutorial) => {
      console.log(`${tutorial.order}. ${tutorial.title} (${tutorial.slug})`);
      console.log(`   📁 MDX: ${tutorial.mdxFile}`);
      console.log(`   🧠 Quiz Questions: ${tutorial.quizzes[0]?.questions ? (tutorial.quizzes[0].questions as unknown[]).length : 0}`);
      console.log(`   🎯 Difficulty: ${tutorial.difficulty}`);
      console.log("");
    });

  } catch (error) {
    console.error("❌ Error updating tutorial structure:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateTutorialStructure()
  .then(() => {
    console.log("🎉 Database update completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Failed to update database:", error);
    process.exit(1);
  });
