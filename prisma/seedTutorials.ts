import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TUTORIALS = [
  // FUNDAMENTALS CATEGORY
  {
    slug: "variables-and-data-types",
    title: "Variables and Data Types",
    description:
      "Learn the fundamentals of JavaScript variables, data types, and how to work with them effectively",
    mdxFile: "fundamentals/01-variables-and-data-types",
    category: "fundamentals",
    difficulty: 1,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Variables and Data Types Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question:
            "Which keyword is used to declare a block-scoped variable in JavaScript?",
          options: ["var", "let", "const", "variable"],
          correct: 1,
          explanation:
            "The 'let' keyword declares a block-scoped variable that can be reassigned.",
        },
        {
          question: "What data type is returned by typeof null?",
          options: ["null", "undefined", "object", "boolean"],
          correct: 2,
          explanation:
            "This is a famous JavaScript quirk - typeof null returns 'object' due to a legacy bug.",
        },
        {
          question:
            "Which of these is NOT a primitive data type in JavaScript?",
          options: ["string", "number", "array", "boolean"],
          correct: 2,
          explanation:
            "Array is an object type, not a primitive. Primitives are string, number, boolean, null, undefined, symbol, and bigint.",
        },
      ],
    },
  },
  {
    slug: "functions-fundamentals",
    title: "Functions Fundamentals",
    description:
      "Master JavaScript functions, parameters, return values, and function expressions",
    mdxFile: "fundamentals/02-functions-fundamentals",
    category: "fundamentals",
    difficulty: 1,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Functions Fundamentals Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question:
            "What is the difference between function declarations and function expressions?",
          options: [
            "No difference",
            "Declarations are hoisted, expressions are not",
            "Expressions are faster",
            "Declarations can't have parameters",
          ],
          correct: 1,
          explanation:
            "Function declarations are hoisted (available before declaration), while function expressions are not.",
        },
        {
          question:
            "What does a function return if no return statement is specified?",
          options: ["null", "0", "undefined", "empty string"],
          correct: 2,
          explanation:
            "JavaScript functions return undefined by default when no return statement is present.",
        },
      ],
    },
  },
  {
    slug: "functions-and-scope",
    title: "Functions and Scope",
    description:
      "Deep dive into function scope, closures, and the execution context in JavaScript",
    mdxFile: "fundamentals/02-functions-and-scope",
    category: "fundamentals",
    difficulty: 2,
    order: 3,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Functions and Scope Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "What is a closure in JavaScript?",
          options: [
            "A way to close functions",
            "A function that has access to variables from its outer scope",
            "A type of loop",
            "A method to end program execution",
          ],
          correct: 1,
          explanation:
            "A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned.",
        },
      ],
    },
  },
  {
    slug: "arrays-and-objects",
    title: "Arrays and Objects",
    description:
      "Learn to work with JavaScript's most important data structures: arrays and objects",
    mdxFile: "fundamentals/03-arrays-and-objects",
    category: "fundamentals",
    difficulty: 1,
    order: 4,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Arrays and Objects Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "Which method adds elements to the end of an array?",
          options: ["unshift()", "push()", "pop()", "shift()"],
          correct: 1,
          explanation:
            "The push() method adds one or more elements to the end of an array and returns the new length.",
        },
        {
          question: "How do you access object properties?",
          options: [
            "Only with dot notation",
            "Only with bracket notation",
            "Both dot notation and bracket notation",
            "With parentheses",
          ],
          correct: 2,
          explanation:
            "Object properties can be accessed using both dot notation (obj.prop) and bracket notation (obj['prop']).",
        },
      ],
    },
  },
  {
    slug: "control-structures",
    title: "Control Structures: Making Decisions in JavaScript",
    description:
      "Master conditional statements, loops, and control flow to make your programs dynamic and intelligent",
    mdxFile: "fundamentals/04-control-structures",
    category: "fundamentals",
    difficulty: 2,
    order: 5,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Control Structures Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "Which loop is guaranteed to run at least once?",
          options: ["for loop", "while loop", "do...while loop", "for...of loop"],
          correct: 2,
          explanation:
            "The do...while loop executes the code block first, then checks the condition, ensuring it runs at least once.",
        },
        {
          question: "What does the 'break' statement do in a loop?",
          options: [
            "Skips the current iteration",
            "Exits the loop immediately",
            "Restarts the loop",
            "Does nothing",
          ],
          correct: 1,
          explanation:
            "The 'break' statement terminates the loop immediately and continues with the statement after the loop.",
        },
        {
          question: "Which operator checks for strict equality?",
          options: ["=", "==", "===", "!="],
          correct: 2,
          explanation:
            "The === operator checks for strict equality, comparing both value and type without type conversion.",
        },
        {
          question: "What is the ternary operator syntax?",
          options: [
            "if ? then : else",
            "condition ? trueValue : falseValue",
            "condition : trueValue ? falseValue",
            "? condition : trueValue : falseValue",
          ],
          correct: 1,
          explanation:
            "The ternary operator syntax is: condition ? valueIfTrue : valueIfFalse",
        },
        {
          question: "Which loop is best for iterating over array values?",
          options: ["for...in loop", "while loop", "for...of loop", "do...while loop"],
          correct: 2,
          explanation:
            "The for...of loop is specifically designed to iterate over values in iterable objects like arrays.",
        },
      ],
    },
  },

  // OOP CATEGORY
  {
    slug: "introduction-to-objects",
    title: "Introduction to Objects",
    description:
      "Learn the fundamentals of object-oriented programming in JavaScript, including object creation, properties, and methods",
    mdxFile: "oop/01-introduction-to-objects",
    category: "oop",
    difficulty: 2,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Introduction to Objects Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question:
            "What does the 'this' keyword refer to in an object method?",
          options: [
            "The global object",
            "The object that owns the method",
            "The parent object",
            "Nothing",
          ],
          correct: 1,
          explanation:
            "'this' refers to the object that is calling the method, allowing access to the object's properties and other methods.",
        },
        {
          question: "Which is the preferred way to access object properties?",
          options: [
            "Bracket notation",
            "Dot notation",
            "Both are equally good",
            "Using getter functions",
          ],
          correct: 1,
          explanation:
            "Dot notation is preferred when possible as it's more readable and concise. Bracket notation is used for dynamic property names.",
        },
      ],
    },
  },
  {
    slug: "constructor-functions-and-prototypes",
    title: "Constructor Functions and Prototypes",
    description:
      "Master constructor functions and JavaScript's prototype system for creating reusable object blueprints",
    mdxFile: "oop/02-constructor-functions-and-prototypes",
    category: "oop",
    difficulty: 2,
    order: 2,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
    quiz: {
      title: "Constructor Functions and Prototypes Quiz",
      isPremium: true,
      requiredPlan: "VIBED",
      questions: [
        {
          question:
            "What is the main benefit of adding methods to a constructor's prototype?",
          options: [
            "Methods run faster",
            "Methods are shared among all instances, saving memory",
            "Methods are private",
            "Methods are automatically inherited",
          ],
          correct: 1,
          explanation:
            "Adding methods to the prototype means all instances share the same function object, which is more memory-efficient than creating new functions for each instance.",
        },
        {
          question:
            "What happens if you call a constructor function without the 'new' keyword?",
          options: [
            "It throws an error",
            "It works the same way",
            "'this' refers to the global object instead of a new instance",
            "It returns undefined",
          ],
          correct: 2,
          explanation:
            "Without 'new', 'this' refers to the global object (or undefined in strict mode), which can cause unexpected behavior.",
        },
      ],
    },
  },

  // ADVANCED CATEGORY
  {
    slug: "advanced-functions-scope",
    title: "Advanced Functions and Scope",
    description:
      "Explore advanced concepts like closures, IIFE, and complex scope scenarios",
    mdxFile: "advanced/03-advanced-functions-scope",
    category: "advanced",
    difficulty: 3,
    order: 1,
    published: true,
    isPremium: true,
    requiredPlan: "CRACKED",
    quiz: {
      title: "Advanced Functions and Scope Quiz",
      isPremium: true,
      requiredPlan: "CRACKED",
      questions: [
        {
          question:
            "What is an IIFE (Immediately Invoked Function Expression) used for?",
          options: [
            "Making functions run faster",
            "Creating private scope and avoiding global pollution",
            "Handling errors automatically",
            "Creating classes",
          ],
          correct: 1,
          explanation:
            "IIFEs create an isolated scope that executes immediately, preventing variables from polluting the global scope.",
        },
      ],
    },
  },

  // ASYNC CATEGORY
  {
    slug: "asynchronous-javascript-mastery",
    title: "Asynchronous JavaScript Mastery",
    description:
      "Master async programming with callbacks, promises, async/await, and modern JavaScript patterns",
    mdxFile: "async/04-asynchronous-javascript-mastery",
    category: "async",
    difficulty: 3,
    order: 1,
    published: true,
    isPremium: true,
    requiredPlan: "CRACKED",
    quiz: {
      title: "Asynchronous JavaScript Mastery Quiz",
      isPremium: true,
      requiredPlan: "CRACKED",
      questions: [
        {
          question:
            "What is the main benefit of asynchronous programming in JavaScript?",
          options: [
            "It makes code run faster",
            "It prevents the main thread from blocking while waiting for operations",
            "It automatically fixes bugs",
            "It reduces memory usage",
          ],
          correct: 1,
          explanation:
            "Asynchronous programming allows JavaScript to handle other tasks while waiting for time-consuming operations, keeping the UI responsive.",
        },
        {
          question: "Which of these represents the correct Promise states?",
          options: [
            "waiting, completed, failed",
            "pending, fulfilled, rejected",
            "starting, running, finished",
            "loading, success, error",
          ],
          correct: 1,
          explanation:
            "A Promise has three states: pending (initial), fulfilled (successful completion), and rejected (failed).",
        },
        {
          question: "What does Promise.all() do?",
          options: [
            "Runs promises one after another",
            "Waits for all promises to resolve, fails if any rejects",
            "Returns the fastest promise",
            "Cancels all promises",
          ],
          correct: 1,
          explanation:
            "Promise.all() waits for all promises to resolve and returns an array of results. If any promise rejects, the entire operation fails.",
        },
      ],
    },
  },

  // DOM CATEGORY
  {
    slug: "dom-manipulation",
    title: "DOM Manipulation",
    description:
      "Learn to dynamically manipulate web page content using the Document Object Model",
    mdxFile: "dom/05-dom-manipulation",
    category: "dom",
    difficulty: 2,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "DOM Manipulation Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question:
            "Which method is used to select a single element by its ID?",
          options: [
            "getElementsById()",
            "getElementById()",
            "querySelector()",
            "selectById()",
          ],
          correct: 1,
          explanation:
            "getElementById() is the specific method for selecting an element by its ID attribute.",
        },
        {
          question: "What's the difference between innerHTML and textContent?",
          options: [
            "No difference",
            "innerHTML parses HTML, textContent treats everything as plain text",
            "textContent is faster",
            "innerHTML is deprecated",
          ],
          correct: 1,
          explanation:
            "innerHTML parses and renders HTML tags, while textContent treats all content as plain text and is safer from XSS attacks.",
        },
      ],
    },
  },
];

async function seedTutorials() {
  try {
    console.log("🌱 Starting tutorial seeding...");

    for (const tutorialData of TUTORIALS) {
      const { quiz, ...tutorial } = tutorialData;

      // Create or update tutorial
      const createdTutorial = await prisma.tutorial.upsert({
        where: { slug: tutorial.slug },
        update: {
          ...tutorial,
          published: true, // Ensure all tutorials are published
        },
        create: {
          ...tutorial,
          published: true,
        },
      });

      console.log(
        `✅ Tutorial created/updated: ${createdTutorial.title} (Category: ${createdTutorial.category})`
      );

      if (quiz) {
        // Create or update quiz
        const quizSlug = `${tutorial.slug}-quiz`;
        const createdQuiz = await prisma.quiz.upsert({
          where: { slug: quizSlug },
          update: {
            title: quiz.title,
            tutorialId: createdTutorial.id,
            questions: quiz.questions,
            isPremium: quiz.isPremium,
            requiredPlan: quiz.requiredPlan,
          },
          create: {
            title: quiz.title,
            slug: quizSlug,
            tutorialId: createdTutorial.id,
            questions: quiz.questions,
            isPremium: quiz.isPremium,
            requiredPlan: quiz.requiredPlan,
          },
        });

        console.log(
          `✅ Quiz created/updated: ${createdQuiz.title} with ${quiz.questions.length} questions`
        );
      }
    }

    console.log("🎉 Tutorial seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total tutorials: ${TUTORIALS.length}`);
    console.log(
      `   - Fundamentals: ${
        TUTORIALS.filter((t) => t.category === "fundamentals").length
      }`
    );
    console.log(
      `   - OOP: ${TUTORIALS.filter((t) => t.category === "oop").length}`
    );
    console.log(
      `   - Advanced: ${
        TUTORIALS.filter((t) => t.category === "advanced").length
      }`
    );
    console.log(
      `   - Async: ${TUTORIALS.filter((t) => t.category === "async").length}`
    );
    console.log(
      `   - DOM: ${TUTORIALS.filter((t) => t.category === "dom").length}`
    );
    console.log(
      `   - Free tutorials: ${TUTORIALS.filter((t) => !t.isPremium).length}`
    );
    console.log(
      `   - Premium tutorials: ${TUTORIALS.filter((t) => t.isPremium).length}`
    );
  } catch (error) {
    console.error("❌ Error seeding tutorials:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding

seedTutorials().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { seedTutorials, TUTORIALS };
