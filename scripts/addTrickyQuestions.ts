import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const evenMoreTrickyQuestions = [
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
  {
    question: "Gotcha! What happens: console.log(+'5' + +'3');",
    options: ["'53'", "8", "NaN", "Error"],
    correct: 1,
    explanation:
      "The unary + operator converts strings to numbers. +'5' becomes 5, +'3' becomes 3, so 5 + 3 = 8. Tricky but logical!",
    difficulty: "hard",
  },
  {
    question: "What's the output of: console.log(typeof typeof 42);",
    options: ["number", "string", "undefined", "object"],
    correct: 1,
    explanation:
      "typeof 42 returns 'number' (a string), then typeof 'number' returns 'string'. So the final result is 'string'!",
    difficulty: "hard",
  },
  {
    question: "Sneaky! What happens: let x = 1; let x = 2; console.log(x);",
    options: ["1", "2", "undefined", "SyntaxError"],
    correct: 3,
    explanation:
      "You cannot redeclare a 'let' variable in the same scope. This throws a SyntaxError during parsing, not runtime!",
    difficulty: "medium",
  },
  {
    question: "Brain teaser: console.log(3 > 2 > 1);",
    options: ["true", "false", "Error", "undefined"],
    correct: 1,
    explanation:
      "This evaluates left to right: (3 > 2) is true, then true > 1 becomes 1 > 1 (true converts to 1), which is false!",
    difficulty: "hard",
  },
  {
    question: "What's this madness: console.log(null >= 0);",
    options: ["true", "false", "Error", "undefined"],
    correct: 0,
    explanation:
      "The >= operator converts null to 0, so 0 >= 0 is true. But null == 0 is false! JavaScript comparison is wild 🤯",
    difficulty: "hard",
  },
];

async function addMoreTrickyQuestions() {
  try {
    console.log("🧠 Adding even MORE tricky JavaScript questions...");

    const quiz = await prisma.quiz.findFirst({
      where: { tutorialId: "1" },
    });

    if (!quiz) {
      console.log("❌ Quiz not found");
      return;
    }

    await prisma.quiz.update({
      where: { id: quiz.id },
      data: { questions: evenMoreTrickyQuestions },
    });

    console.log("🔥 Updated with MAXIMUM TRICKINESS!");
    console.log(`📊 Total questions: ${evenMoreTrickyQuestions.length}`);

    const breakdown = {
      easy: evenMoreTrickyQuestions.filter((q) => q.difficulty === "easy")
        .length,
      medium: evenMoreTrickyQuestions.filter((q) => q.difficulty === "medium")
        .length,
      hard: evenMoreTrickyQuestions.filter((q) => q.difficulty === "hard")
        .length,
    };

    console.log(`📈 Difficulty breakdown:`);
    console.log(`   - Easy: ${breakdown.easy} questions (basics)`);
    console.log(`   - Medium: ${breakdown.medium} questions (gotchas)`);
    console.log(`   - Hard: ${breakdown.hard} questions (mind-benders)`);

    console.log(`\n🎯 New Tricky Features Added:`);
    console.log(`   ✅ Type coercion tricks (false == '0', null >= 0)`);
    console.log(`   ✅ Operator precedence gotchas (3 > 2 > 1)`);
    console.log(`   ✅ Unary operator confusion (+'5' + +'3')`);
    console.log(`   ✅ Nested typeof behavior (typeof typeof 42)`);
    console.log(`   ✅ Variable redeclaration traps (let x = 1; let x = 2)`);
    console.log(`   ✅ Array to string conversion madness ([] + [])`);
    console.log(`   ✅ Floating-point precision issues (0.1 + 0.2)`);
    console.log(`   ✅ Hoisting confusion with var`);
    console.log(`   ✅ Temporal Dead Zone concepts`);
    console.log(`   ✅ const object mutability`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreTrickyQuestions();
