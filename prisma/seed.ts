import { PrismaClient } from "@prisma/client";
import { basicChallenges } from "../src/data/challenges/basic";
import { algorithmChallenges } from "../src/data/challenges/algorithms";
import { slugify, generateUniqueSlug } from "../src/lib/slugify";

const prisma = new PrismaClient();

// Tutorial data to seed - now referencing actual MDX files
const TUTORIALS = [
  {
    id: "1",
    slug: "javascript-basics",
    title: "JavaScript Basics: Variables and Data Types",
    description:
      "Learn the fundamentals of JavaScript variables and data types",
    mdxFile: "01-variables-and-data-types", // Reference to actual MDX file
    difficulty: 1,
    order: 1,
    quiz: {
      title: "JavaScript Basics Quiz",
      questions: [
        {
          question:
            "Which keyword is used to declare a constant in JavaScript?",
          options: ["var", "let", "const", "final"],
          correct: 2,
          explanation:
            "The 'const' keyword is used to declare constants that cannot be reassigned.",
          difficulty: "easy",
        },
        {
          question: "What will 'console.log(2 + '2')' output?",
          options: ["4", "22", "NaN", "Error"],
          correct: 1,
          explanation:
            "JavaScript converts the number 2 to a string and concatenates it with '2', resulting in '22'.",
          difficulty: "easy",
        },
        {
          question: "Which of these is NOT a JavaScript data type?",
          options: ["string", "boolean", "integer", "undefined"],
          correct: 2,
          explanation:
            "JavaScript has 'number' type but not specifically 'integer'. It uses floating-point numbers.",
          difficulty: "easy",
        },
        {
          question: "What is the result of 'typeof null' in JavaScript?",
          options: ["null", "undefined", "object", "boolean"],
          correct: 2,
          explanation:
            "This is a famous JavaScript quirk - 'typeof null' returns 'object' due to a bug that can't be fixed without breaking existing code.",
          difficulty: "medium",
        },
        {
          question: "What happens when you try to reassign a const variable?",
          options: [
            "The value changes",
            "TypeError is thrown",
            "Returns undefined",
            "Creates a new variable",
          ],
          correct: 1,
          explanation:
            "Attempting to reassign a const variable throws a TypeError at runtime.",
          difficulty: "easy",
        },
        {
          question: "What is the output of: let x; console.log(typeof x);",
          options: ["null", "undefined", "object", "string"],
          correct: 1,
          explanation:
            "Declared but uninitialized variables have the value 'undefined', and typeof undefined is 'undefined'.",
          difficulty: "medium",
        },
        {
          question: "Which statement about template literals is TRUE?",
          options: [
            "They use single quotes",
            "They use double quotes",
            "They use backticks and allow embedded expressions",
            "They can't span multiple lines",
          ],
          correct: 2,
          explanation:
            "Template literals use backticks (`) and allow embedded expressions with ${} syntax, plus they can span multiple lines.",
          difficulty: "medium",
        },
        {
          question: "What's the tricky output of: console.log(false == '0');",
          options: ["true", "false", "TypeError", "undefined"],
          correct: 0,
          explanation:
            "The == operator performs type coercion. false becomes 0, and '0' becomes 0, so 0 == 0 is true. This is why === is preferred!",
          difficulty: "hard",
        },
        {
          question:
            "What happens with: const obj = {}; obj.prop = 'value'; console.log(obj.prop);",
          options: [
            "Error - can't modify const",
            "'value' is logged",
            "undefined",
            "TypeError",
          ],
          correct: 1,
          explanation:
            "const prevents reassignment of the variable, but object contents can still be modified. The reference is constant, not the object itself.",
          difficulty: "hard",
        },
        {
          question:
            "Tricky one! What's the output of: console.log(0.1 + 0.2 === 0.3);",
          options: ["true", "false", "NaN", "TypeError"],
          correct: 1,
          explanation:
            "This is false due to floating-point precision issues. 0.1 + 0.2 equals 0.30000000000000004 in JavaScript!",
          difficulty: "hard",
        },
        {
          question: "What's the difference between null and undefined?",
          options: [
            "No difference - they're the same",
            "null is intentional absence, undefined is unintentional",
            "undefined is intentional absence, null is unintentional",
            "They're different spellings of the same thing",
          ],
          correct: 1,
          explanation:
            "null represents intentional absence of value (you set it), while undefined means a variable exists but hasn't been assigned a value.",
          difficulty: "medium",
        },
        {
          question: "What happens in the Temporal Dead Zone?",
          options: [
            "Variables are automatically undefined",
            "let/const variables exist but can't be accessed",
            "Variables are hoisted like var",
            "Nothing special happens",
          ],
          correct: 1,
          explanation:
            "The Temporal Dead Zone is the time between when let/const variables enter scope and when they're declared. Accessing them throws ReferenceError.",
          difficulty: "hard",
        },
        {
          question:
            "Super tricky! What's logged: var a = 1; function test() { console.log(a); var a = 2; } test();",
          options: ["1", "2", "undefined", "ReferenceError"],
          correct: 2,
          explanation:
            "Due to hoisting, 'var a' is hoisted to the top of the function but not initialized, so it's undefined when logged. This is why let/const are better!",
          difficulty: "hard",
        },
        {
          question: "What makes a value 'falsy' in JavaScript?",
          options: [
            "Only false is falsy",
            "false, 0, '', null, undefined, NaN",
            "Any string is falsy",
            "Only null and undefined",
          ],
          correct: 1,
          explanation:
            "JavaScript has 6 falsy values: false, 0, '' (empty string), null, undefined, and NaN. Everything else is truthy!",
          difficulty: "medium",
        },
        {
          question: "Mind-bender! What's the output: console.log([] + []);",
          options: ["[]", "[[]]", "'' (empty string)", "Error"],
          correct: 2,
          explanation:
            "When adding arrays, JavaScript converts them to strings. Empty array becomes empty string, so '' + '' = '' (empty string).",
          difficulty: "hard",
        },
      ],
    },
  },
  {
    id: "2",
    slug: "functions-and-scope",
    title: "Functions and Scope",
    description: "Master JavaScript functions and understand scope",
    mdxFile: "02-functions-and-scope", // Reference to actual MDX file
    difficulty: 2,
    order: 2,
    quiz: {
      title: "Functions and Scope Quiz",
      questions: [
        {
          question: "What is function scope?",
          options: [
            "Functions can access all variables",
            "Variables declared inside a function are only accessible within that function",
            "Functions don't have scope",
            "Scope is about function names",
          ],
          correct: 1,
          explanation:
            "Variables declared inside a function are only accessible within that function unless explicitly returned or made global.",
        },
        {
          question: "What is a closure in JavaScript?",
          options: [
            "A way to close functions",
            "A function that has access to variables in its outer scope",
            "A function without parameters",
            "A function that doesn't return anything",
          ],
          correct: 1,
          explanation:
            "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has finished executing.",
        },
        {
          question:
            "What's the difference between function declaration and function expression?",
          options: [
            "No difference",
            "Declaration is hoisted, expression is not",
            "Expression is hoisted, declaration is not",
            "Both are the same",
          ],
          correct: 1,
          explanation:
            "Function declarations are hoisted (can be called before they're defined), while function expressions are not hoisted.",
        },
        {
          question: "What does 'this' refer to in a regular function?",
          options: [
            "The function itself",
            "The global object (or undefined in strict mode)",
            "Always undefined",
            "The parent function",
          ],
          correct: 1,
          explanation:
            "In regular functions, 'this' refers to the global object (window in browsers) or undefined in strict mode.",
        },
        {
          question: "What is an arrow function?",
          options: [
            "A function with arrows in its name",
            "A shorter syntax for writing functions using =>",
            "A function that points to something",
            "A function that returns arrows",
          ],
          correct: 1,
          explanation:
            "Arrow functions provide a shorter syntax for writing functions using the => operator and have different 'this' binding behavior.",
        },
      ],
    },
  },
  {
    id: "3",
    slug: "arrays-and-objects",
    title: "Arrays and Objects",
    description:
      "Master data structures and learn to organize information effectively",
    mdxFile: "03-arrays-and-objects", // Reference to actual MDX file
    difficulty: 1,
    order: 3,
    quiz: {
      title: "Arrays and Objects Quiz",
      questions: [
        {
          question: "How do you add an element to the end of an array?",
          options: [
            "array.add()",
            "array.push()",
            "array.append()",
            "array.insert()",
          ],
          correct: 1,
          explanation:
            "The push() method adds one or more elements to the end of an array.",
        },
        {
          question: "What does the map() method do?",
          options: [
            "Filters array elements",
            "Creates a new array with transformed elements",
            "Sorts the array",
            "Finds an element",
          ],
          correct: 1,
          explanation:
            "map() creates a new array with the results of calling a function for every array element.",
        },
        {
          question: "How do you access an object property?",
          options: [
            "object.property or object['property']",
            "object->property",
            "object::property",
            "object.get('property')",
          ],
          correct: 0,
          explanation:
            "You can access object properties using dot notation (object.property) or bracket notation (object['property']).",
        },
        {
          question: "Which method removes the last element from an array?",
          options: ["removeLast()", "pop()", "delete()", "splice()"],
          correct: 1,
          explanation:
            "The pop() method removes and returns the last element from an array.",
        },
        {
          question: "What does Object.keys() return?",
          options: [
            "Values of the object",
            "Array of property names",
            "Number of properties",
            "The object itself",
          ],
          correct: 1,
          explanation:
            "Object.keys() returns an array of a given object's property names.",
        },
      ],
    },
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed tutorials first
  console.log("📚 Seeding tutorials...");
  for (const tutorialData of TUTORIALS) {
    console.log(`📖 Creating tutorial: ${tutorialData.title}`);

    // Create tutorial
    const tutorial = await prisma.tutorial.create({
      data: {
        id: tutorialData.id,
        slug: tutorialData.slug,
        title: tutorialData.title,
        description: tutorialData.description,
        mdxFile: tutorialData.mdxFile, // Store the MDX file reference
        difficulty: tutorialData.difficulty,
        order: tutorialData.order,
        published: true,
      },
    });

    // Create associated quiz
    await prisma.quiz.create({
      data: {
        id: tutorialData.id, // Use same ID as tutorial for easy lookup
        tutorialId: tutorial.id,
        title: tutorialData.quiz.title,
        questions: JSON.stringify(tutorialData.quiz.questions),
      },
    });

    console.log(`✅ Created tutorial and quiz: ${tutorialData.title}`);
  }

  console.log(`🎉 Seeded ${TUTORIALS.length} tutorials successfully!`);

  // Seed challenges
  console.log("🎯 Seeding challenges...");

  // Combine all challenges
  const allChallenges = [...basicChallenges, ...algorithmChallenges];
  const existingSlugs: string[] = [];

  for (const challenge of allChallenges) {
    console.log(`🔧 Creating challenge: ${challenge.title}`);

    // Generate unique slug
    const baseSlug = slugify(challenge.title);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
    existingSlugs.push(uniqueSlug);

    // Create the challenge
    const createdChallenge = await prisma.challenge.create({
      data: {
        id: challenge.id,
        slug: uniqueSlug,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty.toUpperCase() as
          | "EASY"
          | "MEDIUM"
          | "HARD",
        type: challenge.type.toUpperCase() as
          | "ALGORITHM"
          | "FUNCTION"
          | "ARRAY"
          | "OBJECT"
          | "LOGIC",
        estimatedTime: challenge.estimatedTime,
        starter: challenge.starter,
        solution: challenge.solution,
        published: true,
      },
    });

    // Create mood adaptations
    await prisma.challengeMoodAdaptation.createMany({
      data: [
        {
          challengeId: createdChallenge.id,
          mood: "CHILL",
          content: challenge.moodAdapted.chill,
        },
        {
          challengeId: createdChallenge.id,
          mood: "RUSH",
          content: challenge.moodAdapted.rush,
        },
        {
          challengeId: createdChallenge.id,
          mood: "GRIND",
          content: challenge.moodAdapted.grind,
        },
      ],
    });

    // Create test cases
    await prisma.challengeTest.createMany({
      data: challenge.tests.map((test, index) => ({
        challengeId: createdChallenge.id,
        input: JSON.stringify(test.input),
        expected: JSON.stringify(test.expected),
        description: test.description,
        order: index,
      })),
    });

    console.log(`✅ Created challenge: ${challenge.title}`);
  }

  console.log(`🎉 Seeded ${allChallenges.length} challenges successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
