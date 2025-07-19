import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const enhancedQuestions = [
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
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
];

async function updateQuizQuestions() {
  try {
    console.log("🔄 Updating JavaScript Basics quiz questions...");

    // Find the quiz for tutorial ID "1"
    const quiz = await prisma.quiz.findFirst({
      where: {
        tutorialId: "1",
      },
    });

    if (!quiz) {
      console.log("❌ Quiz not found for tutorial ID 1");
      return;
    }

    console.log(`📋 Found quiz: ${quiz.title}`);
    console.log(`� Updating quiz questions...`);

    // Update the quiz with new questions
    await prisma.quiz.update({
      where: {
        id: quiz.id,
      },
      data: {
        questions: enhancedQuestions,
      },
    });

    console.log("✅ Quiz questions updated successfully!");
    console.log(`📊 Total questions: ${enhancedQuestions.length}`);
    console.log(`📈 Difficulty breakdown:`);

    const easyCount = enhancedQuestions.filter(
      (q) => q.difficulty === "easy"
    ).length;
    const mediumCount = enhancedQuestions.filter(
      (q) => q.difficulty === "medium"
    ).length;
    const hardCount = enhancedQuestions.filter(
      (q) => q.difficulty === "hard"
    ).length;

    console.log(`   - Easy: ${easyCount} questions`);
    console.log(`   - Medium: ${mediumCount} questions`);
    console.log(`   - Hard: ${hardCount} questions`);

    console.log(`\n🎯 Quiz Features:`);
    console.log(
      `   - Covers all tutorial topics: variables, data types, const/let/var`
    );
    console.log(
      `   - Includes tricky edge cases: hoisting, type coercion, floating-point`
    );
    console.log(`   - Gen-Z friendly content with modern JavaScript concepts`);
    console.log(
      `   - Progressive difficulty from basic syntax to advanced concepts`
    );
  } catch (error) {
    console.error("❌ Error updating quiz questions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateQuizQuestions();
