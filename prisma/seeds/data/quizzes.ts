// Quiz data for tutorial 1: Variables and Data Types
export const quiz1 = {
  id: 1,
  tutorialId: 1,
  title: "Variables and Data Types Quiz",
  questions: [
    {
      id: 1,
      question:
        "Which keyword should you use to declare a variable that won't be reassigned?",
      options: ["var", "let", "const", "final"],
      correct: 2,
      explanation:
        "`const` is used for variables that won't be reassigned. It creates a constant reference.",
      difficulty: "easy",
    },
    {
      id: 2,
      question: "What will `typeof null` return in JavaScript?",
      options: ["null", "undefined", "object", "string"],
      correct: 2,
      explanation:
        "This is a famous JavaScript quirk! `typeof null` returns 'object', which is considered a bug but remains for backward compatibility.",
      difficulty: "medium",
    },
    {
      id: 3,
      question: "Which of these is NOT a primitive data type in JavaScript?",
      options: ["string", "boolean", "array", "number"],
      correct: 2,
      explanation:
        "Arrays are objects in JavaScript, not primitive types. The primitive types are: string, number, boolean, undefined, null, symbol, and bigint.",
      difficulty: "easy",
    },
    {
      id: 4,
      question: "What happens when you try to reassign a `const` variable?",
      options: [
        "The value changes successfully",
        "JavaScript throws a TypeError",
        "The variable becomes undefined",
        "Nothing happens",
      ],
      correct: 1,
      explanation:
        "Attempting to reassign a `const` variable throws a TypeError: Assignment to constant variable.",
      difficulty: "easy",
    },
    {
      id: 5,
      question:
        "What is the difference between `let` and `var` in terms of scope?",
      options: [
        "There is no difference",
        "`let` is function-scoped, `var` is block-scoped",
        "`let` is block-scoped, `var` is function-scoped",
        "Both are globally scoped",
      ],
      correct: 2,
      explanation:
        "`let` is block-scoped (exists only within the nearest enclosing block), while `var` is function-scoped (exists throughout the entire function).",
      difficulty: "medium",
    },
  ],
};

// Quiz data for tutorial 2: Functions and Scope
export const quiz2 = {
  id: 2,
  tutorialId: 2,
  title: "Functions and Scope Quiz",
  questions: [
    {
      id: 1,
      question:
        "What is the difference between function declarations and function expressions in terms of hoisting?",
      options: [
        "Both are hoisted",
        "Neither are hoisted",
        "Function declarations are hoisted, expressions are not",
        "Function expressions are hoisted, declarations are not",
      ],
      correct: 2,
      explanation:
        "Function declarations are fully hoisted and can be called before they're defined. Function expressions are not hoisted.",
      difficulty: "medium",
    },
    {
      id: 2,
      question:
        "What does this arrow function return: `const add = (a, b) => a + b`?",
      options: ["undefined", "The sum of a and b", "A function", "An error"],
      correct: 1,
      explanation:
        "Arrow functions with a single expression automatically return that expression's value. So this returns `a + b`.",
      difficulty: "easy",
    },
    {
      id: 3,
      question:
        "What will happen if you call a function without providing required parameters?",
      options: [
        "JavaScript throws an error",
        "The missing parameters become undefined",
        "The function won't execute",
        "JavaScript provides default values",
      ],
      correct: 1,
      explanation:
        "Missing parameters are automatically set to `undefined`. JavaScript doesn't enforce parameter requirements.",
      difficulty: "easy",
    },
    {
      id: 4,
      question: "In the scope chain, where does JavaScript look for variables?",
      options: [
        "Only in global scope",
        "Only in local scope",
        "From innermost to outermost scope",
        "From outermost to innermost scope",
      ],
      correct: 2,
      explanation:
        "JavaScript follows the scope chain from innermost (current) scope outward to global scope when looking for variables.",
      difficulty: "medium",
    },
    {
      id: 5,
      question: "What is a closure in JavaScript?",
      options: [
        "A function that returns another function",
        "A function that has access to variables from its outer scope",
        "A function with no parameters",
        "A function that calls itself",
      ],
      correct: 1,
      explanation:
        "A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has finished executing.",
      difficulty: "hard",
    },
    {
      id: 6,
      question: "What does the rest parameter (...args) allow you to do?",
      options: [
        "Pass an unlimited number of arguments to a function",
        "Create default parameter values",
        "Return multiple values",
        "Create arrow functions",
      ],
      correct: 0,
      explanation:
        "The rest parameter (...args) allows a function to accept an unlimited number of arguments as an array.",
      difficulty: "medium",
    },
  ],
};

// Quiz data for tutorial 3: Arrays and Objects
export const quiz3 = {
  id: 3,
  tutorialId: 3,
  title: "Arrays and Objects Quiz",
  questions: [
    {
      id: 1,
      question:
        "How do you access the first element of an array called 'fruits'?",
      options: ["fruits[1]", "fruits[0]", "fruits.first()", "fruits.get(0)"],
      correct: 1,
      explanation:
        "Arrays are zero-indexed in JavaScript, so the first element is at index 0.",
      difficulty: "easy",
    },
    {
      id: 2,
      question: "Which method adds an element to the end of an array?",
      options: ["unshift()", "append()", "push()", "add()"],
      correct: 2,
      explanation:
        "`push()` adds one or more elements to the end of an array and returns the new length.",
      difficulty: "easy",
    },
    {
      id: 3,
      question:
        "What is the correct way to create an object with name and age properties?",
      options: [
        "let person = ['name': 'John', 'age': 25]",
        "let person = {name: 'John', age: 25}",
        "let person = (name: 'John', age: 25)",
        "let person = <name: 'John', age: 25>",
      ],
      correct: 1,
      explanation:
        "Objects are created using curly braces {} with key-value pairs separated by colons.",
      difficulty: "easy",
    },
    {
      id: 4,
      question: "What will `array.length` return for the array [1, 2, 3, 4]?",
      options: ["3", "4", "5", "undefined"],
      correct: 1,
      explanation:
        "The `length` property returns the number of elements in an array. [1, 2, 3, 4] has 4 elements.",
      difficulty: "easy",
    },
    {
      id: 5,
      question:
        "Which array method creates a new array with all elements that pass a test?",
      options: ["map()", "filter()", "reduce()", "find()"],
      correct: 1,
      explanation:
        "`filter()` creates a new array with all elements that pass the test implemented by the provided function.",
      difficulty: "medium",
    },
    {
      id: 6,
      question:
        "How do you access a property called 'email' in an object called 'user'?",
      options: [
        "user->email",
        "user.email or user['email']",
        "user::email",
        "user[email]",
      ],
      correct: 1,
      explanation:
        "Object properties can be accessed using dot notation (user.email) or bracket notation (user['email']).",
      difficulty: "easy",
    },
    {
      id: 7,
      question: "What does the `map()` method return?",
      options: [
        "The original array modified",
        "A new array with the results of calling a function for every array element",
        "A single value",
        "True or false",
      ],
      correct: 1,
      explanation:
        "`map()` creates a new array populated with the results of calling a provided function on every element in the calling array.",
      difficulty: "medium",
    },
  ],
};

export type Quiz = typeof quiz1;
export type Question = (typeof quiz1.questions)[0];
