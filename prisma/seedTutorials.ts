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
        {
          question: "What is the difference between 'let' and 'const'?",
          options: [
            "No difference",
            "let can be reassigned, const cannot",
            "const is faster",
            "let is block-scoped, const is function-scoped"
          ],
          correct: 1,
          explanation:
            "Variables declared with 'let' can be reassigned, while 'const' variables cannot be reassigned after initialization.",
        },
        {
          question: "Which of these will cause a ReferenceError?",
          options: [
            "Using a var variable before declaration",
            "Using a let variable before declaration",
            "Using a const variable after declaration",
            "Declaring the same var twice"
          ],
          correct: 1,
          explanation:
            "Accessing a 'let' or 'const' variable before its declaration causes a ReferenceError due to the temporal dead zone.",
        },
        {
          question: "What is the result of: typeof undefined?",
          options: ["null", "undefined", "object", "string"],
          correct: 1,
          explanation:
            "The typeof operator returns 'undefined' for undefined values.",
        },
        {
          question: "Which statement about var is TRUE?",
          options: [
            "var is block-scoped",
            "var variables are hoisted",
            "var cannot be redeclared",
            "var requires initialization"
          ],
          correct: 1,
          explanation:
            "Variables declared with 'var' are hoisted to the top of their scope and initialized with undefined.",
        },
        {
          question: "What happens when you declare a variable without any keyword?",
          options: [
            "Creates a local variable",
            "Creates a global variable",
            "Throws a syntax error",
            "Creates a constant"
          ],
          correct: 1,
          explanation:
            "In non-strict mode, variables declared without a keyword become global variables, which is generally bad practice.",
        },
        {
          question: "Which is the correct way to declare multiple variables?",
          options: [
            "let a, b, c;",
            "let a; b; c;",
            "let a + b + c;",
            "let (a, b, c);"
          ],
          correct: 0,
          explanation:
            "Multiple variables can be declared in one statement using commas: let a, b, c;",
        },
        {
          question: "What is the data type of NaN?",
          options: ["NaN", "undefined", "number", "string"],
          correct: 2,
          explanation:
            "NaN (Not a Number) is ironically of type 'number' in JavaScript.",
        },
        {
          question: "How do you check if a variable is NaN?",
          options: [
            "variable === NaN",
            "typeof variable === 'NaN'",
            "Number.isNaN(variable)",
            "variable == NaN"
          ],
          correct: 2,
          explanation:
            "Number.isNaN() is the reliable way to check for NaN. NaN is not equal to itself, so === NaN always returns false.",
        },
        {
          question: "What does the following return: typeof typeof 42?",
          options: ["number", "string", "undefined", "object"],
          correct: 1,
          explanation:
            "typeof 42 returns 'number' (a string), then typeof 'number' returns 'string'.",
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
        {
          question: "How do you define a function with parameters?",
          options: [
            "function myFunc[a, b] {}",
            "function myFunc(a, b) {}",
            "function myFunc{a, b} {}",
            "function myFunc <a, b> {}"
          ],
          correct: 1,
          explanation:
            "Parameters are defined inside parentheses: function myFunc(a, b) {}",
        },
        {
          question: "What is the scope of function parameters?",
          options: [
            "Global scope",
            "Local to the function",
            "Block scope only",
            "No scope"
          ],
          correct: 1,
          explanation:
            "Function parameters are local variables within the function scope.",
        },
        {
          question: "What happens when you call a function with fewer arguments than parameters?",
          options: [
            "Error is thrown",
            "Missing parameters are undefined",
            "Function won't execute",
            "Missing parameters are null"
          ],
          correct: 1,
          explanation:
            "Missing arguments result in undefined values for those parameters.",
        },
        {
          question: "Which is the correct syntax for an arrow function?",
          options: [
            "=> (a, b) { return a + b; }",
            "(a, b) => { return a + b; }",
            "(a, b) -> { return a + b; }",
            "function => (a, b) { return a + b; }"
          ],
          correct: 1,
          explanation:
            "Arrow functions use the syntax: (parameters) => { function body }",
        },
        {
          question: "What does the 'arguments' object contain?",
          options: [
            "Function parameters only",
            "All arguments passed to the function",
            "Return values",
            "Variable declarations"
          ],
          correct: 1,
          explanation:
            "The 'arguments' object contains all arguments passed to the function, even if there are more than the defined parameters.",
        },
        {
          question: "How do you create a function that can accept any number of arguments?",
          options: [
            "Use the arguments object",
            "Use rest parameters (...args)",
            "Both A and B",
            "Use spread operator"
          ],
          correct: 2,
          explanation:
            "Both the arguments object and rest parameters (...args) allow functions to accept variable numbers of arguments.",
        },
        {
          question: "What is the difference between function scope and block scope?",
          options: [
            "No difference",
            "Function scope is created by functions, block scope by {}",
            "Block scope is older",
            "Function scope is faster"
          ],
          correct: 1,
          explanation:
            "Function scope is created by function declarations/expressions, while block scope is created by curly braces {} with let/const.",
        }
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
        {
          question: "What is lexical scoping?",
          options: [
            "Scope determined by where variables are declared",
            "Scope determined at runtime",
            "Global scope only",
            "No scoping rules"
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
            "Only parent function variables"
          ],
          correct: 1,
          explanation:
            "A nested function has access to variables in its own scope, its parent function's scope, and the global scope.",
        },
        {
          question: "What happens to outer function variables after the function returns?",
          options: [
            "They are destroyed immediately",
            "They remain accessible if referenced by a closure",
            "They become global variables",
            "They throw an error"
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
            "A type of data structure"
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
            "When variables are global"
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
            "Private variables don't exist in JavaScript"
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
            "A database pattern"
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
            "The server only"
          ],
          correct: 1,
          explanation:
            "Execution context is the environment in which JavaScript code is executed, containing variables, functions, and the scope chain.",
        }
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
        {
          question: "Which method removes the last element from an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correct: 1,
          explanation:
            "The pop() method removes and returns the last element from an array.",
        },
        {
          question: "How do you create an empty array?",
          options: [
            "var arr = {}",
            "var arr = []",
            "var arr = new Object()",
            "var arr = Array"
          ],
          correct: 1,
          explanation:
            "An empty array is created using square brackets: var arr = []",
        },
        {
          question: "What does array.length return?",
          options: [
            "The index of the last element",
            "The number of elements in the array",
            "The memory size of the array",
            "The array type"
          ],
          correct: 1,
          explanation:
            "The length property returns the number of elements in an array.",
        },
        {
          question: "How do you add a property to an object?",
          options: [
            "obj.newProp = value or obj['newProp'] = value",
            "obj->newProp = value",
            "obj::newProp = value",
            "addProperty(obj, 'newProp', value)"
          ],
          correct: 0,
          explanation:
            "Properties can be added using dot notation (obj.newProp = value) or bracket notation (obj['newProp'] = value).",
        },
        {
          question: "What is the difference between arrays and objects?",
          options: [
            "No difference",
            "Arrays use numeric indices, objects use string keys",
            "Objects are faster",
            "Arrays can't store functions"
          ],
          correct: 1,
          explanation:
            "Arrays are indexed numerically (0, 1, 2...) while objects use string keys for properties.",
        },
        {
          question: "How do you check if a property exists in an object?",
          options: [
            "obj.hasProperty('prop')",
            "'prop' in obj or obj.hasOwnProperty('prop')",
            "obj.contains('prop')",
            "obj.exists('prop')"
          ],
          correct: 1,
          explanation:
            "Use 'prop' in obj to check if a property exists, or obj.hasOwnProperty('prop') for own properties only.",
        },
        {
          question: "What does JSON.stringify() do?",
          options: [
            "Converts a string to an object",
            "Converts an object to a JSON string",
            "Validates JSON format",
            "Creates a new object"
          ],
          correct: 1,
          explanation:
            "JSON.stringify() converts a JavaScript object into a JSON string representation.",
        }
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
        {
          question: "How do you create an object using object literal syntax?",
          options: [
            "var obj = new Object()",
            "var obj = {}",
            "var obj = Object.create()",
            "var obj = Object()"
          ],
          correct: 1,
          explanation:
            "Object literal syntax uses curly braces: var obj = {}",
        },
        {
          question: "What is a method in an object?",
          options: [
            "A property that stores data",
            "A property that stores a function",
            "A way to create objects",
            "A type of variable"
          ],
          correct: 1,
          explanation:
            "A method is a property of an object that contains a function as its value.",
        },
        {
          question: "When must you use bracket notation to access properties?",
          options: [
            "Always",
            "When property names have spaces or special characters",
            "Never",
            "Only with arrays"
          ],
          correct: 1,
          explanation:
            "Bracket notation is required when property names contain spaces, start with numbers, or are stored in variables.",
        },
        {
          question: "What does Object.keys() return?",
          options: [
            "Object values",
            "Array of object property names",
            "Object methods only",
            "Object length"
          ],
          correct: 1,
          explanation:
            "Object.keys() returns an array containing all enumerable property names of an object.",
        },
        {
          question: "How do you delete a property from an object?",
          options: [
            "obj.property = null",
            "delete obj.property",
            "obj.remove('property')",
            "obj.property = undefined"
          ],
          correct: 1,
          explanation:
            "The delete operator removes a property from an object: delete obj.property",
        },
        {
          question: "What is object destructuring?",
          options: [
            "Breaking objects into pieces",
            "Extracting properties from objects into variables",
            "Deleting object properties",
            "Creating new objects"
          ],
          correct: 1,
          explanation:
            "Object destructuring allows extracting properties from objects and assigning them to variables in a single statement.",
        },
        {
          question: "What is the difference between Object.create() and object literals?",
          options: [
            "No difference",
            "Object.create() allows setting the prototype chain",
            "Object literals are faster",
            "Object.create() is deprecated"
          ],
          correct: 1,
          explanation:
            "Object.create() allows you to specify the prototype of the new object, while object literals use Object.prototype by default.",
        }
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
        {
          question: "What is a constructor function?",
          options: [
            "A function that constructs buildings",
            "A function used to create and initialize objects",
            "A function that cannot be called",
            "A function that only returns values"
          ],
          correct: 1,
          explanation:
            "A constructor function is used to create and initialize objects of a specific type.",
        },
        {
          question: "What does the 'new' keyword do?",
          options: [
            "Creates a new variable",
            "Creates a new object, sets up prototype chain, and binds 'this'",
            "Creates a new function",
            "Creates a new scope"
          ],
          correct: 1,
          explanation:
            "The 'new' keyword creates a new object, sets up the prototype chain, binds 'this' to the new object, and returns the object.",
        },
        {
          question: "How do you access the prototype of a constructor function?",
          options: [
            "ConstructorFunc.prototype",
            "ConstructorFunc.__proto__",
            "ConstructorFunc.getPrototype()",
            "new ConstructorFunc().prototype"
          ],
          correct: 0,
          explanation:
            "The prototype property of a constructor function is accessed using ConstructorFunc.prototype",
        },
        {
          question: "What is the prototype chain?",
          options: [
            "A chain of function calls",
            "A series of linked objects used for property lookup",
            "A way to chain constructors",
            "A method of inheritance only"
          ],
          correct: 1,
          explanation:
            "The prototype chain is a series of linked objects that JavaScript uses to look up properties and methods.",
        },
        {
          question: "How do you check if an object is an instance of a constructor?",
          options: [
            "obj.constructor === Constructor",
            "obj instanceof Constructor",
            "typeof obj === Constructor",
            "obj.isInstance(Constructor)"
          ],
          correct: 1,
          explanation:
            "The instanceof operator checks if an object is an instance of a specific constructor function.",
        },
        {
          question: "What is the difference between __proto__ and prototype?",
          options: [
            "No difference",
            "__proto__ is on instances, prototype is on constructor functions",
            "prototype is deprecated",
            "__proto__ is faster"
          ],
          correct: 1,
          explanation:
            "__proto__ is a property on object instances that points to their prototype, while prototype is a property on constructor functions.",
        },
        {
          question: "How do you create inheritance using prototypes?",
          options: [
            "Use extends keyword only",
            "Set Child.prototype = Object.create(Parent.prototype)",
            "Use super() function",
            "Inheritance is not possible with prototypes"
          ],
          correct: 1,
          explanation:
            "Prototypal inheritance is achieved by setting Child.prototype = Object.create(Parent.prototype)",
        }
      ],
    },
  },
  {
    slug: "typescript-oop",
    title: "Object-Oriented Programming with TypeScript",
    description:
      "Master advanced OOP concepts using TypeScript's powerful type system, including classes, interfaces, generics, and design patterns",
    mdxFile: "oop/03-typescript-oop",
    category: "oop",
    difficulty: 3,
    order: 3,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
    quiz: {
      title: "TypeScript OOP Quiz",
      isPremium: true,
      requiredPlan: "VIBED",
      questions: [
        {
          question:
            "What is the main advantage of using TypeScript's access modifiers (private, protected, public)?",
          options: [
            "They make code run faster",
            "They provide compile-time encapsulation and better IDE support",
            "They are required for inheritance",
            "They automatically generate documentation",
          ],
          correct: 1,
          explanation:
            "Access modifiers provide encapsulation at compile time, helping prevent unauthorized access to class members and improving IDE autocomplete and error detection.",
        },
        {
          question: "What is the purpose of an interface in TypeScript?",
          options: [
            "To create instances of objects",
            "To define the structure/contract that objects must follow",
            "To provide default implementations",
            "To handle errors automatically",
          ],
          correct: 1,
          explanation:
            "Interfaces define contracts that specify what properties and methods an object must have, enabling better type checking and code documentation.",
        },
        {
          question: "How do generics improve type safety in TypeScript classes?",
          options: [
            "They eliminate all runtime errors",
            "They allow type parameters to be specified when using the class",
            "They automatically validate data",
            "They make classes run faster",
          ],
          correct: 1,
          explanation:
            "Generics allow you to create reusable classes that work with different types while maintaining type safety through parameterized types.",
        },
        {
          question: "What is the difference between abstract classes and interfaces?",
          options: [
            "Abstract classes can have implementations, interfaces cannot",
            "Interfaces are faster than abstract classes",
            "Abstract classes are deprecated",
            "No difference - they're the same",
          ],
          correct: 0,
          explanation:
            "Abstract classes can contain both abstract methods (no implementation) and concrete methods (with implementation), while interfaces only define contracts without implementations.",
        },
        {
          question: "Which TypeScript feature helps prevent the instantiation of a class more than once?",
          options: [
            "Private constructor in Singleton pattern",
            "Abstract classes",
            "Interfaces",
            "Generics",
          ],
          correct: 0,
          explanation:
            "The Singleton pattern uses a private constructor and static method to ensure only one instance of a class can be created.",
        },
        {
          question: "What does the 'readonly' modifier do in TypeScript?",
          options: [
            "Makes properties faster to access",
            "Prevents properties from being modified after initialization",
            "Makes properties private",
            "Automatically validates property values",
          ],
          correct: 1,
          explanation:
            "The readonly modifier prevents a property from being modified after it's initialized, providing immutability at compile time.",
        },
        {
          question: "How do you implement multiple inheritance of behavior in TypeScript?",
          options: [
            "Use multiple extends keywords",
            "Use interfaces and composition",
            "Use abstract classes only",
            "Multiple inheritance is not possible",
          ],
          correct: 1,
          explanation:
            "TypeScript supports single class inheritance but you can implement multiple interfaces and use composition to achieve multiple inheritance of behavior.",
        },
        {
          question: "What is a type guard in TypeScript?",
          options: [
            "A security feature that protects code",
            "A function that narrows types at runtime",
            "A way to prevent type errors",
            "A method to validate user input",
          ],
          correct: 1,
          explanation:
            "Type guards are functions that perform runtime checks to narrow union types, allowing TypeScript to understand which specific type you're working with.",
        },
        {
          question: "Which pattern is best for creating objects when you don't know the exact type until runtime?",
          options: [
            "Singleton pattern",
            "Observer pattern",
            "Factory pattern",
            "Strategy pattern",
          ],
          correct: 2,
          explanation:
            "The Factory pattern provides a way to create objects without specifying their exact class, making decisions about which type to instantiate at runtime.",
        },
        {
          question: "What is the benefit of using the 'super' keyword in TypeScript inheritance?",
          options: [
            "It makes the class run faster",
            "It calls the parent class constructor or methods",
            "It automatically implements interfaces",
            "It provides type safety",
          ],
          correct: 1,
          explanation:
            "The 'super' keyword allows you to call the parent class constructor and methods, ensuring proper initialization and enabling method extension in inheritance.",
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
        {
          question: "What is the correct syntax for an IIFE?",
          options: [
            "(function() { })();",
            "function() { }();",
            "immediate function() { };",
            "function()() { };"
          ],
          correct: 0,
          explanation:
            "An IIFE is wrapped in parentheses and immediately invoked: (function() { })();",
        },
        {
          question: "What is currying in JavaScript?",
          options: [
            "A cooking technique",
            "Transforming a function with multiple arguments into nested functions",
            "A way to speed up functions",
            "A method of error handling"
          ],
          correct: 1,
          explanation:
            "Currying transforms a function that takes multiple arguments into a series of functions that each take a single argument.",
        },
        {
          question: "What is partial application?",
          options: [
            "Applying some arguments to a function and returning a new function",
            "Running only part of a function",
            "A broken function",
            "A function that returns undefined"
          ],
          correct: 0,
          explanation:
            "Partial application involves fixing some arguments of a function and returning a new function that accepts the remaining arguments.",
        },
        {
          question: "What is a higher-order function?",
          options: [
            "A function with many parameters",
            "A function that takes functions as arguments or returns functions",
            "A function at the top of the file",
            "A function with complex logic"
          ],
          correct: 1,
          explanation:
            "A higher-order function either takes one or more functions as arguments or returns a function.",
        },
        {
          question: "What is memoization?",
          options: [
            "A memory management technique",
            "Caching function results to improve performance",
            "Remembering variable names",
            "A debugging technique"
          ],
          correct: 1,
          explanation:
            "Memoization is an optimization technique where function results are cached to avoid redundant calculations.",
        },
        {
          question: "What is the call() method used for?",
          options: [
            "Making phone calls",
            "Calling a function with a specific 'this' context",
            "Creating function calls",
            "Calling callbacks"
          ],
          correct: 1,
          explanation:
            "The call() method invokes a function with a specific 'this' value and arguments provided individually.",
        },
        {
          question: "What is the difference between call() and apply()?",
          options: [
            "No difference",
            "call() takes individual arguments, apply() takes an array",
            "apply() is faster",
            "call() is deprecated"
          ],
          correct: 1,
          explanation:
            "call() accepts arguments individually, while apply() accepts arguments as an array.",
        },
        {
          question: "What does the bind() method do?",
          options: [
            "Binds variables together",
            "Creates a new function with a specific 'this' context",
            "Connects two functions",
            "Validates function parameters"
          ],
          correct: 1,
          explanation:
            "The bind() method creates a new function with a permanently bound 'this' value and optionally preset arguments.",
        }
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
        {
          question: "What is a callback function?",
          options: [
            "A function that calls back to the server",
            "A function passed as an argument to be executed later",
            "A function that returns another function",
            "A function that handles errors"
          ],
          correct: 1,
          explanation:
            "A callback function is passed as an argument to another function and is executed at a later time or when a specific event occurs.",
        },
        {
          question: "What is callback hell?",
          options: [
            "When callbacks are very slow",
            "Deeply nested callbacks that make code hard to read",
            "When callbacks throw errors",
            "When callbacks are undefined"
          ],
          correct: 1,
          explanation:
            "Callback hell refers to deeply nested callback functions that make code difficult to read, debug, and maintain.",
        },
        {
          question: "How do you create a Promise?",
          options: [
            "new Promise((resolve, reject) => {})",
            "Promise.create((success, fail) => {})",
            "createPromise((yes, no) => {})",
            "Promise((resolve, reject) => {})"
          ],
          correct: 0,
          explanation:
            "A Promise is created using: new Promise((resolve, reject) => { /* executor function */ })",
        },
        {
          question: "What does async/await do?",
          options: [
            "Makes code run asynchronously",
            "Provides syntactic sugar for working with Promises",
            "Speeds up function execution",
            "Handles errors automatically"
          ],
          correct: 1,
          explanation:
            "async/await provides a more readable syntax for working with Promises, making asynchronous code look more like synchronous code.",
        },
        {
          question: "What does Promise.race() do?",
          options: [
            "Runs promises in sequence",
            "Returns the result of the first promise to settle",
            "Compares promise performance",
            "Cancels slower promises"
          ],
          correct: 1,
          explanation:
            "Promise.race() returns a promise that settles with the value or reason of the first promise that settles.",
        },
        {
          question: "How do you handle errors in async/await?",
          options: [
            "Use .catch() method",
            "Use try/catch blocks",
            "Use error callbacks",
            "Errors are handled automatically"
          ],
          correct: 1,
          explanation:
            "Errors in async/await are handled using try/catch blocks around the await expression.",
        }
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
        {
          question: "How do you select elements by class name?",
          options: [
            "getElementsByClassName('className')",
            "getElementByClass('className')",
            "selectByClass('className')",
            "findByClassName('className')"
          ],
          correct: 0,
          explanation:
            "getElementsByClassName() returns a live HTMLCollection of elements with the specified class name.",
        },
        {
          question: "What does querySelector() return?",
          options: [
            "All matching elements",
            "The first matching element",
            "The last matching element",
            "A boolean value"
          ],
          correct: 1,
          explanation:
            "querySelector() returns the first element that matches the specified CSS selector.",
        },
        {
          question: "How do you create a new HTML element?",
          options: [
            "document.createElement('tagName')",
            "document.newElement('tagName')",
            "createElement('tagName')",
            "new Element('tagName')"
          ],
          correct: 0,
          explanation:
            "document.createElement() creates a new HTML element with the specified tag name.",
        },
        {
          question: "How do you add an element to the DOM?",
          options: [
            "element.add()",
            "parentElement.appendChild(element)",
            "document.add(element)",
            "element.insert()"
          ],
          correct: 1,
          explanation:
            "appendChild() adds a new child element to the end of the parent's children list.",
        },
        {
          question: "What is the difference between addEventListener and onclick?",
          options: [
            "No difference",
            "addEventListener can attach multiple listeners, onclick only one",
            "onclick is faster",
            "addEventListener is deprecated"
          ],
          correct: 1,
          explanation:
            "addEventListener allows multiple event listeners for the same event, while onclick property can only hold one function.",
        },
        {
          question: "How do you remove an element from the DOM?",
          options: [
            "element.delete()",
            "element.remove() or parentElement.removeChild(element)",
            "element.destroy()",
            "delete element"
          ],
          correct: 1,
          explanation:
            "Elements can be removed using element.remove() or parentElement.removeChild(element).",
        },
        {
          question: "What is event bubbling?",
          options: [
            "When events create bubbles",
            "Events propagating from child to parent elements",
            "When events fail to execute",
            "A way to prevent events"
          ],
          correct: 1,
          explanation:
            "Event bubbling is the propagation of events from the target element up through its parent elements in the DOM tree.",
        }
      ],
    },
  },

  // HTML CATEGORY
  {
    slug: "html-basics",
    title: "HTML Fundamentals: Building Your First Web Page",
    description:
      "Learn the essential HTML elements and structure to create your first web page",
    mdxFile: "html/01-html-basics",
    category: "html",
    difficulty: 1,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "HTML Fundamentals Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language"
          ],
          correct: 0,
          explanation:
            "HTML stands for HyperText Markup Language, the standard markup language for creating web pages."
        },
        {
          question: "Which tag is used to create the largest heading?",
          options: ["<h6>", "<h1>", "<header>", "<heading>"],
          correct: 1,
          explanation:
            "The <h1> tag creates the largest heading in HTML, representing the most important heading level."
        },
        {
          question: "What is the correct way to create a link to another website?",
          options: [
            "<link href='https://example.com'>Example</link>",
            "<a href='https://example.com'>Example</a>",
            "<url>https://example.com</url>",
            "<website url='https://example.com'>Example</website>"
          ],
          correct: 1,
          explanation:
            "The <a> tag with the href attribute is used to create hyperlinks to other web pages."
        },
        {
          question: "Which attribute is required for the <img> tag for accessibility?",
          options: ["src", "alt", "title", "width"],
          correct: 1,
          explanation:
            "The alt attribute provides alternative text for images, which is essential for screen readers and accessibility."
        },
        {
          question: "What is the purpose of the <!DOCTYPE html> declaration?",
          options: [
            "To include CSS styles",
            "To tell the browser this is an HTML5 document",
            "To create a comment",
            "To import JavaScript"
          ],
          correct: 1,
          explanation:
            "The <!DOCTYPE html> declaration tells the browser that this is an HTML5 document and should be rendered accordingly."
        },
        {
          question: "Which tag is used to create an unordered list?",
          options: ["<ol>", "<ul>", "<list>", "<ulist>"],
          correct: 1,
          explanation:
            "The <ul> tag creates an unordered (bulleted) list, while <ol> creates an ordered (numbered) list."
        },
        {
          question: "What is semantic HTML?",
          options: [
            "HTML that looks good",
            "HTML that uses meaningful elements that describe their content",
            "HTML with CSS styling",
            "HTML with JavaScript functionality"
          ],
          correct: 1,
          explanation:
            "Semantic HTML uses elements that clearly describe their meaning and content, improving accessibility and SEO."
        },
        {
          question: "Which tag should contain the main content of a web page?",
          options: ["<content>", "<body>", "<main>", "<section>"],
          correct: 2,
          explanation:
            "The <main> element contains the main content of the document, excluding headers, footers, and navigation."
        },
        {
          question: "What is the difference between <strong> and <b>?",
          options: [
            "No difference",
            "<strong> has semantic meaning (importance), <b> is just visual styling",
            "<b> is better for accessibility",
            "<strong> is deprecated"
          ],
          correct: 1,
          explanation:
            "<strong> indicates importance semantically, while <b> is purely presentational. <strong> is better for accessibility."
        },
        {
          question: "Which input type is used for email addresses in forms?",
          options: [
            "<input type='text'>",
            "<input type='email'>",
            "<input type='mail'>",
            "<input type='address'>"
          ],
          correct: 1,
          explanation:
            "The input type='email' provides built-in email validation and appropriate mobile keyboards."
        },
        {
          question: "What does the 'required' attribute do in form inputs?",
          options: [
            "Makes the input larger",
            "Changes the input color",
            "Makes the field mandatory to fill before submission",
            "Adds a tooltip"
          ],
          correct: 2,
          explanation:
            "The required attribute makes form fields mandatory - the form cannot be submitted without filling them."
        },
        {
          question: "Which tag is used to group related form elements?",
          options: ["<group>", "<fieldset>", "<formgroup>", "<section>"],
          correct: 1,
          explanation:
            "The <fieldset> tag groups related form controls and is often used with <legend> to provide a caption."
        },
        {
          question: "What is the purpose of the <head> section?",
          options: [
            "Contains visible page content",
            "Contains metadata about the document",
            "Contains the page header",
            "Contains navigation links"
          ],
          correct: 1,
          explanation:
            "The <head> contains metadata like title, character encoding, viewport settings, and links to CSS/JavaScript files."
        },
        {
          question: "Which tag creates a line break?",
          options: ["<break>", "<br>", "<lb>", "<newline>"],
          correct: 1,
          explanation:
            "The <br> tag creates a line break and is one of the few self-closing tags in HTML."
        },
        {
          question: "How do you add a comment in HTML?",
          options: [
            "// This is a comment",
            "/* This is a comment */",
            "<!-- This is a comment -->",
            "# This is a comment"
          ],
          correct: 2,
          explanation:
            "HTML comments are written using <!-- comment text --> and are not visible on the rendered page."
        }
      ],
    },
  },

  // DATA STRUCTURES CATEGORY
  {
    slug: "introduction-to-arrays",
    title: "Introduction to Arrays and Array Methods",
    description:
      "Master JavaScript arrays - the fundamental data structure for organizing and manipulating collections of data",
    mdxFile: "data-structures/01-introduction-to-arrays",
    category: "data-structures",
    difficulty: 3,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    quiz: {
      title: "Arrays and Array Methods Quiz",
      isPremium: false,
      requiredPlan: "FREE",
      questions: [
        {
          question: "Which method adds elements to the end of an array?",
          options: ["unshift()", "push()", "pop()", "shift()"],
          correct: 1,
          explanation:
            "The push() method adds one or more elements to the end of an array and returns the new length."
        },
        {
          question: "What does the array method map() return?",
          options: [
            "The original array modified",
            "A new array with transformed elements",
            "The first element that matches",
            "True or false"
          ],
          correct: 1,
          explanation:
            "The map() method creates a new array with the results of calling a function for every array element."
        },
        {
          question: "Which method is best for finding elements that meet a condition?",
          options: ["forEach()", "map()", "filter()", "reduce()"],
          correct: 2,
          explanation:
            "The filter() method creates a new array with all elements that pass a test implemented by the provided function."
        },
        {
          question: "What does the reduce() method do?",
          options: [
            "Removes elements from an array",
            "Filters array elements",
            "Reduces array to a single value",
            "Sorts array elements"
          ],
          correct: 2,
          explanation:
            "The reduce() method executes a reducer function on each element, resulting in a single output value."
        },
        {
          question: "Which method removes the last element from an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correct: 1,
          explanation:
            "The pop() method removes the last element from an array and returns that element."
        },
        {
          question: "What is the difference between slice() and splice()?",
          options: [
            "No difference",
            "slice() modifies original, splice() creates new",
            "slice() creates new, splice() modifies original",
            "splice() is faster"
          ],
          correct: 2,
          explanation:
            "slice() returns a shallow copy without modifying the original array, while splice() changes the original array."
        },
        {
          question: "Which method would you use to check if an array contains a specific value?",
          options: ["contains()", "includes()", "has()", "exists()"],
          correct: 1,
          explanation:
            "The includes() method determines whether an array includes a certain value among its entries."
        },
        {
          question: "What does [...array] create?",
          options: [
            "A reference to the original array",
            "A shallow copy of the array",
            "A deep copy of the array",
            "An error"
          ],
          correct: 1,
          explanation:
            "The spread operator [...array] creates a shallow copy of the array with new references for the array itself."
        },
        {
          question: "Which array method should you avoid for performance with large arrays?",
          options: ["forEach()", "map()", "indexOf() in a loop", "filter()"],
          correct: 2,
          explanation:
            "Using indexOf() in a loop creates O(n²) complexity, which is inefficient for large arrays."
        },
        {
          question: "What happens when you call map() without returning a value?",
          options: [
            "Returns the original array",
            "Returns an array of undefined values",
            "Throws an error",
            "Returns an empty array"
          ],
          correct: 1,
          explanation:
            "If no return statement is used in the map callback, each element becomes undefined in the new array."
        }
      ],
    },
  },
];

async function seedTutorials() {
  try {
    console.log("🌱 Starting tutorial seeding...");

    for (const tutorialData of TUTORIALS) {
      const { quiz, category, ...tutorial } = tutorialData;

      // Find the category by slug to get the categoryId
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });

      if (!categoryRecord) {
        console.error(`❌ Category not found: ${category}`);
        continue;
      }

      // Create or update tutorial
      const createdTutorial = await prisma.tutorial.upsert({
        where: { slug: tutorial.slug },
        update: {
          ...tutorial,
          categoryId: categoryRecord.id,
          published: true, // Ensure all tutorials are published
        },
        create: {
          ...tutorial,
          categoryId: categoryRecord.id,
          published: true,
        },
      });

      console.log(
        `✅ Tutorial created/updated: ${createdTutorial.title} (Category: ${categoryRecord.title})`
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
      `   - Data Structures: ${
        TUTORIALS.filter((t) => t.category === "data-structures").length
      }`
    );
    console.log(
      `   - HTML: ${TUTORIALS.filter((t) => t.category === "html").length}`
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
