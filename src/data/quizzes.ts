
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

const domManipulationQuiz = {
  id: 5,
  tutorialId: 5,
  title: "DOM Manipulation with JavaScript",
  questions: [
    {
      id: 1,
      question: "Which method is used to select an element by its ID?",
      options: [
        "document.querySelector('#id')",
        "document.getElementByClass('id')",
        "document.getElementById('id')",
        "document.selectElementById('id')",
      ],
      correct: 2,
      explanation:
        "`document.getElementById('id')` is the standard method for selecting an element by its ID.",
      difficulty: "easy",
    },
    {
      id: 2,
      question: "What does `element.textContent` do?",
      options: [
        "Changes the tag name",
        "Sets or gets the text inside an element",
        "Executes HTML inside the element",
        "Applies inline styles",
      ],
      correct: 1,
      explanation:
        "`textContent` sets or retrieves the plain text inside an element, without interpreting HTML.",
      difficulty: "easy",
    },
    {
      id: 3,
      question:
        "Which property is used to change an element's inline CSS with JavaScript?",
      options: [
        "element.css",
        "element.classList",
        "element.innerStyle",
        "element.style",
      ],
      correct: 3,
      explanation:
        "`element.style` allows you to set or get inline CSS properties like `color`, `backgroundColor`, etc.",
      difficulty: "easy",
    },
    {
      id: 4,
      question: "How do you create a new DOM element in JavaScript?",
      options: [
        "new HTMLElement('div')",
        "document.newElement('div')",
        "document.createElement('div')",
        "create.div()",
      ],
      correct: 2,
      explanation:
        "`document.createElement('div')` creates a new DOM element of the specified tag type.",
      difficulty: "medium",
    },
    {
      id: 5,
      question: "Which method attaches a child to a parent DOM node?",
      options: ["append()", "appendChild()", "addNode()", "attachElement()"],
      correct: 1,
      explanation:
        "`appendChild()` inserts a node as the last child of a parent element.",
      difficulty: "medium",
    },
    {
      id: 6,
      question: "How do you listen to a click event on a button element?",
      options: [
        "button.addListener('click', function...)",
        "button.onClick(function...)",
        "button.event('click', callback)",
        "button.addEventListener('click', function...)",
      ],
      correct: 3,
      explanation:
        "`addEventListener('click', ...)` is the correct way to attach a click event listener to a DOM element.",
      difficulty: "medium",
    },
    {
      id: 7,
      question: "What does `classList.toggle('active')` do?",
      options: [
        "Always adds the class",
        "Always removes the class",
        "Adds the class if it's missing, removes it if it's present",
        "Changes the class name to 'active'",
      ],
      correct: 2,
      explanation:
        "`toggle()` checks if the class exists; if it does, it removes it, otherwise it adds it. Great for show/hide logic.",
      difficulty: "medium",
    },
    {
      id: 8,
      question: "What happens when you use `element.remove()`?",
      options: [
        "It disables the element",
        "It removes the element from the DOM entirely",
        "It clears the content inside the element",
        "It hides the element with CSS",
      ],
      correct: 1,
      explanation:
        "`element.remove()` deletes the element from the DOM structure, making it no longer available visually or via JavaScript.",
      difficulty: "easy",
    },
    {
      id: 9,
      question:
        "What is the difference between `.innerHTML` and `.textContent`?",
      options: [
        "`innerHTML` includes HTML tags; `textContent` only includes text",
        "They are exactly the same",
        "`textContent` includes HTML tags; `innerHTML` does not",
        "`innerHTML` can only be used on inputs",
      ],
      correct: 0,
      explanation:
        "`innerHTML` can parse and insert HTML markup; `textContent` will treat everything as plain text, escaping any tags.",
      difficulty: "medium",
    },
    {
      id: 10,
      question:
        "Which method selects the **first** matching element from the DOM?",
      options: [
        "document.getElementByClassName()",
        "document.querySelectorAll()",
        "document.querySelector()",
        "document.getElementsByTagName()",
      ],
      correct: 2,
      explanation:
        "`querySelector()` returns the first element that matches a given CSS selector. `querySelectorAll()` returns a list.",
      difficulty: "medium",
    },
  ],
};

export const quizzes = {
  4: domManipulationQuiz,
};

export type Quiz = typeof quiz1;
export type Question = (typeof quiz1.questions)[0];
