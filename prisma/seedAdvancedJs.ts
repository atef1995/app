const advancedFunctionsScope = {
  slug: "functions-and-scope",
  title: "Functions and Scope",
  description:
    "Deep dive into function scope, closures, and the execution context in JavaScript",
  mdxFile: "fundamentals/03-advanced-functions-scope",
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
      {
        question: "What is lexical scoping?",
        options: [
          "Scope determined by where variables are declared",
          "Scope determined at runtime",
          "Global scope only",
          "No scoping rules",
        ],
        correct: 0,
        explanation:
          "Lexical scoping means that the scope of a variable is determined by where it is declared in the source code.",
      },
      {
        question: "Which variables can a nested function access?",
        options: [
          "Only its own variables",
          "Variables in its own scope and outer scopes",
          "Only global variables",
          "Only parent function variables",
        ],
        correct: 1,
        explanation:
          "A nested function has access to variables in its own scope, its parent function's scope, and the global scope.",
      },
      {
        question:
          "What happens to outer function variables after the function returns?",
        options: [
          "They are destroyed immediately",
          "They remain accessible if referenced by a closure",
          "They become global variables",
          "They throw an error",
        ],
        correct: 1,
        explanation:
          "If a closure references outer function variables, those variables remain in memory and accessible.",
      },
      {
        question: "What is the scope chain?",
        options: [
          "A way to chain functions together",
          "The order JavaScript looks for variables from inner to outer scope",
          "A method to create variables",
          "A type of data structure",
        ],
        correct: 1,
        explanation:
          "The scope chain is the mechanism JavaScript uses to resolve variable names, starting from the innermost scope and moving outward.",
      },
      {
        question: "What is variable shadowing?",
        options: [
          "When a variable is undefined",
          "When an inner scope variable has the same name as an outer scope variable",
          "When variables are hidden",
          "When variables are global",
        ],
        correct: 1,
        explanation:
          "Variable shadowing occurs when a variable in an inner scope has the same name as a variable in an outer scope, hiding the outer variable.",
      },
      {
        question: "How do you create a private variable in JavaScript?",
        options: [
          "Use the private keyword",
          "Use closures to encapsulate variables",
          "Use var in global scope",
          "Private variables don't exist in JavaScript",
        ],
        correct: 1,
        explanation:
          "Closures can be used to create private variables by encapsulating them within a function scope.",
      },
      {
        question: "What is a module pattern?",
        options: [
          "A way to import modules",
          "Using closures to create private and public methods",
          "A CSS pattern",
          "A database pattern",
        ],
        correct: 1,
        explanation:
          "The module pattern uses closures to create private variables and methods while exposing a public API.",
      },
      {
        question: "What is the execution context?",
        options: [
          "Where code is written",
          "The environment where JavaScript code is executed",
          "The browser only",
          "The server only",
        ],
        correct: 1,
        explanation:
          "Execution context is the environment in which JavaScript code is executed, containing variables, functions, and the scope chain.",
      },
    ],
  },
};
