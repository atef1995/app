import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TUTORIALS = [
  {
    id: "6",
    slug: "asynchronous-javascript-mastery",
    title: "Asynchronous JavaScript Mastery",
    description:
      "Master async programming with callbacks, promises, async/await, and modern JavaScript patterns",
    mdxFile: "04-asynchronous-javascript-mastery", // Reference to actual MDX file
    difficulty: 3, // Advanced level
    order: 6,
    isPremium: true,
    requiredPlan: "CRACKED",
    quiz: {
      title: "Asynchronous JavaScript Mastery Quiz",
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
          difficulty: "easy",
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
          difficulty: "easy",
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
          difficulty: "medium",
        },
        {
          question:
            "What's the main advantage of async/await over Promise chains?",
          options: [
            "It's faster",
            "It uses less memory",
            "It makes asynchronous code look more like synchronous code",
            "It prevents errors",
          ],
          correct: 2,
          explanation:
            "Async/await provides a more readable, synchronous-looking syntax for handling asynchronous operations, reducing callback hell.",
          difficulty: "medium",
        },
        {
          question:
            "What happens if you don't use 'await' with an async function call?",
          options: [
            "It throws an error",
            "It returns a Promise instead of the resolved value",
            "It runs synchronously",
            "It cancels the operation",
          ],
          correct: 1,
          explanation:
            "Without 'await', async function calls return a Promise object rather than the resolved value.",
          difficulty: "medium",
        },
        {
          question:
            "Which Fetch API method is used for POST requests with JSON data?",
          options: [
            "fetch(url, { type: 'POST', data: json })",
            "fetch(url, { method: 'POST', body: JSON.stringify(data) })",
            "fetch.post(url, data)",
            "fetch(url).post(data)",
          ],
          correct: 1,
          explanation:
            "For POST requests with JSON, use fetch with method: 'POST' and body: JSON.stringify(data), plus appropriate headers.",
          difficulty: "medium",
        },
        {
          question:
            "What is the purpose of the AbortController in fetch requests?",
          options: [
            "To retry failed requests",
            "To cancel ongoing requests",
            "To handle errors",
            "To parse response data",
          ],
          correct: 1,
          explanation:
            "AbortController allows you to cancel fetch requests that are no longer needed, preventing unnecessary network usage.",
          difficulty: "hard",
        },
        {
          question: "What does Promise.race() return?",
          options: [
            "An array of all promise results",
            "The result of the fastest resolving promise",
            "The result of the slowest promise",
            "Only successful promise results",
          ],
          correct: 1,
          explanation:
            "Promise.race() returns a promise that resolves or rejects with the value/reason of the first promise that settles.",
          difficulty: "medium",
        },
        {
          question:
            "What's the difference between sequential and parallel async execution?",
          options: [
            "No difference - they're the same",
            "Sequential waits for each operation, parallel runs them simultaneously",
            "Parallel is always slower",
            "Sequential uses more memory",
          ],
          correct: 1,
          explanation:
            "Sequential execution waits for each async operation to complete before starting the next. Parallel execution starts all operations simultaneously.",
          difficulty: "medium",
        },
        {
          question: "What is callback hell?",
          options: [
            "When callbacks throw errors",
            "Deeply nested callbacks that are hard to read and maintain",
            "When callbacks run too fast",
            "When callbacks don't return values",
          ],
          correct: 1,
          explanation:
            "Callback hell refers to deeply nested callback functions that make code difficult to read, debug, and maintain.",
          difficulty: "easy",
        },
        {
          question: "How do you handle errors in async/await functions?",
          options: [
            "Use .catch() method",
            "Use try-catch blocks",
            "Use error callbacks",
            "Errors are handled automatically",
          ],
          correct: 1,
          explanation:
            "In async/await functions, use try-catch blocks to handle both synchronous and asynchronous errors.",
          difficulty: "medium",
        },
        {
          question: "What is the Event Loop in JavaScript?",
          options: [
            "A way to create loops",
            "The mechanism that handles asynchronous operations and callbacks",
            "A debugging tool",
            "A type of event listener",
          ],
          correct: 1,
          explanation:
            "The Event Loop is JavaScript's mechanism for handling asynchronous operations, managing the call stack and callback queue.",
          difficulty: "hard",
        },
        {
          question:
            "Tricky! What's the output order: console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4');",
          options: ["1, 2, 3, 4", "1, 4, 2, 3", "1, 4, 3, 2", "1, 3, 4, 2"],
          correct: 2,
          explanation:
            "Synchronous code runs first (1, 4), then Promise microtasks (3), then setTimeout macrotasks (2). Microtasks have higher priority than macrotasks.",
          difficulty: "hard",
        },
        {
          question: "What is a closure in the context of async programming?",
          options: [
            "A way to close async operations",
            "A function that retains access to variables from its outer scope",
            "A method to handle errors",
            "A type of Promise",
          ],
          correct: 1,
          explanation:
            "Closures allow inner functions to access variables from outer scopes, which is crucial for async callbacks and maintaining state.",
          difficulty: "hard",
        },
        {
          question:
            "Advanced! What happens with: async function test() { return Promise.reject('error'); } test().catch(e => console.log(e));",
          options: [
            "Throws an unhandled error",
            "Logs 'error' to console",
            "Returns undefined",
            "Causes a syntax error",
          ],
          correct: 1,
          explanation:
            "Even though the async function returns a rejected Promise, the .catch() handler catches it and logs 'error' to the console.",
          difficulty: "hard",
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
        update: tutorial,
        create: tutorial,
      });

      console.log(`✅ Tutorial created/updated: ${createdTutorial.title}`);

      if (quiz) {
        // Create or update quiz
        const quizSlug = `${tutorial.slug}-quiz`;
        const createdQuiz = await prisma.quiz.upsert({
          where: { slug: quizSlug },
          update: {
            title: quiz.title,
            tutorialId: createdTutorial.id,
            questions: quiz.questions,
          },
          create: {
            title: quiz.title,
            slug: quizSlug,
            tutorialId: createdTutorial.id,
            questions: quiz.questions,
          },
        });

        console.log(
          `✅ Quiz created/updated: ${createdQuiz.title} with ${quiz.questions.length} questions`
        );
      }
    }

    console.log("🎉 Tutorial seeding completed successfully!");
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
