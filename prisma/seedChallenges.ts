import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const challengeData = [
  {
    slug: "hello-world",
    title: "Hello World Function",
    description: "Create a function that returns 'Hello, World!' when called.",
    difficulty: "EASY",
    type: "FUNCTION",
    estimatedTime: "5 minutes",
    order: 1,
    starter: `function sayHello() {
  // Return "Hello, World!"
  
}`,
    solution: `function sayHello() {
  return "Hello, World!";
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Take your time and enjoy creating your first function! No pressure - just have fun with it.",
      },
      {
        mood: "RUSH",
        content:
          "Quick function challenge! Get that return statement working fast - you've got this!",
      },
      {
        mood: "GRIND",
        content:
          "Focus on understanding exactly how function returns work. This is foundational knowledge.",
      },
    ],
    tests: [
      {
        input: [],
        expected: "Hello, World!",
        description: "Function should return 'Hello, World!'",
        order: 0,
      },
    ],
  },
  {
    slug: "add-numbers",
    title: "Add Two Numbers",
    description:
      "Create a function that takes two numbers and returns their sum.",
    difficulty: "EASY",
    type: "FUNCTION",
    estimatedTime: "5 minutes",
    order: 2,
    starter: `function addNumbers(a, b) {
  // Return the sum of a and b
  
}`,
    solution: `function addNumbers(a, b) {
  return a + b;
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Simple math function - just add the two parameters together and return the result!",
      },
      {
        mood: "RUSH",
        content:
          "Basic addition function - implement it quick with the + operator!",
      },
      {
        mood: "GRIND",
        content:
          "Practice parameter usage and arithmetic operations. Consider edge cases with different number types.",
      },
    ],
    tests: [
      {
        input: [2, 3],
        expected: 5,
        description: "addNumbers(2, 3) should return 5",
        order: 0,
      },
      {
        input: [-1, 1],
        expected: 0,
        description: "addNumbers(-1, 1) should return 0",
        order: 1,
      },
      {
        input: [0, 0],
        expected: 0,
        description: "addNumbers(0, 0) should return 0",
        order: 2,
      },
    ],
  },
  {
    slug: "even-or-odd",
    title: "Even or Odd Checker",
    description:
      "Create a function that determines if a number is even or odd.",
    difficulty: "EASY",
    type: "LOGIC",
    estimatedTime: "8 minutes",
    order: 3,
    starter: `function isEven(number) {
  // Return true if number is even, false if odd
  
}`,
    solution: `function isEven(number) {
  return number % 2 === 0;
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Use the modulo operator (%) to check if a number divides evenly by 2. If remainder is 0, it's even!",
      },
      {
        mood: "RUSH",
        content:
          "Quick logic check! Use % operator to find remainder when divided by 2.",
      },
      {
        mood: "GRIND",
        content:
          "Learn the modulo operator thoroughly - it's crucial for many algorithms. Test edge cases.",
      },
    ],
    tests: [
      {
        input: [4],
        expected: true,
        description: "isEven(4) should return true",
        order: 0,
      },
      {
        input: [7],
        expected: false,
        description: "isEven(7) should return false",
        order: 1,
      },
      {
        input: [0],
        expected: true,
        description: "isEven(0) should return true",
        order: 2,
      },
    ],
  },
  {
    slug: "find-max",
    title: "Find Maximum Number",
    description: "Create a function that finds the largest number in an array.",
    difficulty: "EASY",
    type: "ARRAY",
    estimatedTime: "10 minutes",
    order: 4,
    starter: `function findMax(numbers) {
  // Return the largest number in the array
  
}`,
    solution: `function findMax(numbers) {
  return Math.max(...numbers);
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "You can use Math.max() with the spread operator (...) to find the maximum easily!",
      },
      {
        mood: "RUSH",
        content:
          "Quick solution: Math.max(...numbers) will spread the array and find the max!",
      },
      {
        mood: "GRIND",
        content:
          "Try multiple approaches: Math.max(), reduce(), or a for loop. Compare performance.",
      },
    ],
    tests: [
      {
        input: [[1, 3, 2]],
        expected: 3,
        description: "findMax([1, 3, 2]) should return 3",
        order: 0,
      },
      {
        input: [[-1, -5, -2]],
        expected: -1,
        description: "findMax([-1, -5, -2]) should return -1",
        order: 1,
      },
      {
        input: [[42]],
        expected: 42,
        description: "findMax([42]) should return 42",
        order: 2,
      },
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse a String",
    description: "Create a function that reverses a given string.",
    difficulty: "EASY",
    type: "FUNCTION",
    estimatedTime: "8 minutes",
    order: 5,
    starter: `function reverseString(str) {
  // Return the string reversed
  
}`,
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Split the string into an array, reverse it, then join it back together. Chain those methods!",
      },
      {
        mood: "RUSH",
        content:
          "Quick method chaining: split('').reverse().join('') gets it done fast!",
      },
      {
        mood: "GRIND",
        content:
          "Learn string methods deeply. Try different approaches: loops, recursion, built-in methods.",
      },
    ],
    tests: [
      {
        input: ["hello"],
        expected: "olleh",
        description: "reverseString('hello') should return 'olleh'",
        order: 0,
      },
      {
        input: ["JavaScript"],
        expected: "tpircSavaJ",
        description: "reverseString('JavaScript') should return 'tpircSavaJ'",
        order: 1,
      },
      {
        input: [""],
        expected: "",
        description: "reverseString('') should return ''",
        order: 2,
      },
    ],
  },
  {
    slug: "count-vowels",
    title: "Count Vowels",
    description:
      "Create a function that counts the number of vowels in a string.",
    difficulty: "MEDIUM",
    type: "FUNCTION",
    estimatedTime: "12 minutes",
    order: 6,
    starter: `function countVowels(str) {
  // Count and return the number of vowels (a, e, i, o, u)
  
}`,
    solution: `function countVowels(str) {
  const vowels = 'aeiouAEIOU';
  return str.split('').filter(char => vowels.includes(char)).length;
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Create a vowels string, then filter the input string characters that match. Count the results!",
      },
      {
        mood: "RUSH",
        content:
          "Filter approach: split, filter against vowels string, get length. Quick and clean!",
      },
      {
        mood: "GRIND",
        content:
          "Consider case sensitivity, different approaches (regex, loops, filter). Optimize for readability.",
      },
    ],
    tests: [
      {
        input: ["hello"],
        expected: 2,
        description: "countVowels('hello') should return 2",
        order: 0,
      },
      {
        input: ["JavaScript"],
        expected: 3,
        description: "countVowels('JavaScript') should return 3",
        order: 1,
      },
      {
        input: ["xyz"],
        expected: 0,
        description: "countVowels('xyz') should return 0",
        order: 2,
      },
    ],
  },
  {
    slug: "fibonacci-sequence",
    title: "Fibonacci Number",
    description:
      "Create a function that returns the nth number in the Fibonacci sequence.",
    difficulty: "MEDIUM",
    type: "ALGORITHM",
    estimatedTime: "15 minutes",
    order: 7,
    starter: `function fibonacci(n) {
  // Return the nth Fibonacci number (0, 1, 1, 2, 3, 5, 8, ...)
  
}`,
    solution: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "The Fibonacci sequence: each number is the sum of the two preceding ones. Start with base cases!",
      },
      {
        mood: "RUSH",
        content:
          "Recursive solution: base case for n <= 1, then add the two previous Fibonacci numbers!",
      },
      {
        mood: "GRIND",
        content:
          "Classic algorithm! Try recursive, iterative, and memoized approaches. Compare efficiency.",
      },
    ],
    tests: [
      {
        input: [0],
        expected: 0,
        description: "fibonacci(0) should return 0",
        order: 0,
      },
      {
        input: [1],
        expected: 1,
        description: "fibonacci(1) should return 1",
        order: 1,
      },
      {
        input: [6],
        expected: 8,
        description: "fibonacci(6) should return 8",
        order: 2,
      },
    ],
  },
  {
    slug: "palindrome-check",
    title: "Palindrome Checker",
    description:
      "Create a function that checks if a string is a palindrome (reads the same forwards and backwards).",
    difficulty: "MEDIUM",
    type: "LOGIC",
    estimatedTime: "12 minutes",
    order: 8,
    starter: `function isPalindrome(str) {
  // Return true if str is a palindrome, false otherwise
  
}`,
    solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Clean the string (lowercase, remove spaces/punctuation), then compare with its reverse!",
      },
      {
        mood: "RUSH",
        content:
          "Normalize the string, then check if it equals its reverse. Clean and compare!",
      },
      {
        mood: "GRIND",
        content:
          "Consider edge cases: spaces, punctuation, case sensitivity. Multiple solution approaches.",
      },
    ],
    tests: [
      {
        input: ["racecar"],
        expected: true,
        description: "isPalindrome('racecar') should return true",
        order: 0,
      },
      {
        input: ["hello"],
        expected: false,
        description: "isPalindrome('hello') should return false",
        order: 1,
      },
      {
        input: ["A man a plan a canal Panama"],
        expected: true,
        description:
          "isPalindrome('A man a plan a canal Panama') should return true",
        order: 2,
      },
    ],
  },
  {
    slug: "sum-array",
    title: "Sum Array Elements",
    description:
      "Create a function that calculates the sum of all numbers in an array.",
    difficulty: "EASY",
    type: "ARRAY",
    estimatedTime: "8 minutes",
    order: 9,
    starter: `function sumArray(numbers) {
  // Return the sum of all numbers in the array
  
}`,
    solution: `function sumArray(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Use the reduce method to accumulate the sum. Start with 0 and add each number!",
      },
      {
        mood: "RUSH",
        content:
          "Reduce method: numbers.reduce((sum, num) => sum + num, 0) - quick and functional!",
      },
      {
        mood: "GRIND",
        content:
          "Master the reduce function - it's powerful for array operations. Try other approaches too.",
      },
    ],
    tests: [
      {
        input: [[1, 2, 3, 4]],
        expected: 10,
        description: "sumArray([1, 2, 3, 4]) should return 10",
        order: 0,
      },
      {
        input: [[-1, 1, -2, 2]],
        expected: 0,
        description: "sumArray([-1, 1, -2, 2]) should return 0",
        order: 1,
      },
      {
        input: [[5]],
        expected: 5,
        description: "sumArray([5]) should return 5",
        order: 2,
      },
    ],
  },
  {
    slug: "factorial",
    title: "Calculate Factorial",
    description:
      "Create a function that calculates the factorial of a given number.",
    difficulty: "MEDIUM",
    type: "ALGORITHM",
    estimatedTime: "10 minutes",
    order: 10,
    starter: `function factorial(n) {
  // Return the factorial of n (n! = n � (n-1) � (n-2) � ... � 1)
  
}`,
    solution: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Factorial means multiply a number by all positive integers below it. Base case: 0! and 1! equal 1.",
      },
      {
        mood: "RUSH",
        content:
          "Recursive: base case n <= 1 returns 1, otherwise n * factorial(n-1)!",
      },
      {
        mood: "GRIND",
        content:
          "Classic recursion problem. Compare recursive vs iterative solutions. Handle edge cases.",
      },
    ],
    tests: [
      {
        input: [5],
        expected: 120,
        description: "factorial(5) should return 120",
        order: 0,
      },
      {
        input: [0],
        expected: 1,
        description: "factorial(0) should return 1",
        order: 1,
      },
      {
        input: [1],
        expected: 1,
        description: "factorial(1) should return 1",
        order: 2,
      },
    ],
  },
  {
    slug: "remove-duplicates",
    title: "Remove Duplicates",
    description:
      "Create a function that removes duplicate values from an array.",
    difficulty: "MEDIUM",
    type: "ARRAY",
    estimatedTime: "12 minutes",
    order: 11,
    starter: `function removeDuplicates(arr) {
  // Return a new array with duplicate values removed
  
}`,
    solution: `function removeDuplicates(arr) {
  return [...new Set(arr)];
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "The Set object automatically removes duplicates! Spread it back into an array.",
      },
      {
        mood: "RUSH",
        content:
          "Set + spread operator: [...new Set(arr)] - fastest way to remove duplicates!",
      },
      {
        mood: "GRIND",
        content:
          "Learn Set data structure. Compare with filter + indexOf approach. Understand time complexity.",
      },
    ],
    tests: [
      {
        input: [[1, 2, 2, 3, 4, 4, 5]],
        expected: [1, 2, 3, 4, 5],
        description:
          "removeDuplicates([1, 2, 2, 3, 4, 4, 5]) should return [1, 2, 3, 4, 5]",
        order: 0,
      },
      {
        input: [["a", "b", "a", "c"]],
        expected: ["a", "b", "c"],
        description:
          "removeDuplicates(['a', 'b', 'a', 'c']) should return ['a', 'b', 'c']",
        order: 1,
      },
      {
        input: [[1, 1, 1]],
        expected: [1],
        description: "removeDuplicates([1, 1, 1]) should return [1]",
        order: 2,
      },
    ],
  },
  {
    slug: "capitalize-words",
    title: "Capitalize Words",
    description:
      "Create a function that capitalizes the first letter of each word in a string.",
    difficulty: "MEDIUM",
    type: "FUNCTION",
    estimatedTime: "15 minutes",
    order: 12,
    starter: `function capitalizeWords(str) {
  // Return string with first letter of each word capitalized
  
}`,
    solution: `function capitalizeWords(str) {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Split by spaces, capitalize first letter of each word, join back together!",
      },
      {
        mood: "RUSH",
        content:
          "Split, map with charAt(0).toUpperCase() + slice(1), join. Chain those methods!",
      },
      {
        mood: "GRIND",
        content:
          "String manipulation practice. Handle edge cases: empty strings, single letters, punctuation.",
      },
    ],
    tests: [
      {
        input: ["hello world"],
        expected: "Hello World",
        description:
          "capitalizeWords('hello world') should return 'Hello World'",
        order: 0,
      },
      {
        input: ["javaScript is AWESOME"],
        expected: "Javascript Is Awesome",
        description:
          "capitalizeWords('javaScript is AWESOME') should return 'Javascript Is Awesome'",
        order: 1,
      },
      {
        input: [""],
        expected: "",
        description: "capitalizeWords('') should return ''",
        order: 2,
      },
    ],
  },
  {
    slug: "find-longest-word",
    title: "Find Longest Word",
    description: "Create a function that finds the longest word in a sentence.",
    difficulty: "MEDIUM",
    type: "FUNCTION",
    estimatedTime: "12 minutes",
    order: 13,
    starter: `function findLongestWord(sentence) {
  // Return the longest word in the sentence
  
}`,
    solution: `function findLongestWord(sentence) {
  const words = sentence.split(' ');
  return words.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  );
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Split into words, then use reduce to compare lengths and keep the longest one!",
      },
      {
        mood: "RUSH",
        content:
          "Split and reduce! Compare word lengths and keep the longer one each time.",
      },
      {
        mood: "GRIND",
        content:
          "Practice reduce for comparisons. Consider edge cases: ties, punctuation, empty strings.",
      },
    ],
    tests: [
      {
        input: ["The quick brown fox"],
        expected: "quick",
        description:
          "findLongestWord('The quick brown fox') should return 'quick'",
        order: 0,
      },
      {
        input: ["JavaScript is amazing"],
        expected: "JavaScript",
        description:
          "findLongestWord('JavaScript is amazing') should return 'JavaScript'",
        order: 1,
      },
      {
        input: ["a"],
        expected: "a",
        description: "findLongestWord('a') should return 'a'",
        order: 2,
      },
    ],
  },
  {
    slug: "prime-number-check",
    title: "Prime Number Checker",
    description: "Create a function that checks if a given number is prime.",
    difficulty: "HARD",
    type: "ALGORITHM",
    estimatedTime: "20 minutes",
    order: 14,
    starter: `function isPrime(num) {
  // Return true if num is prime, false otherwise
  
}`,
    solution: `function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "A prime number is only divisible by 1 and itself. Check divisibility up to the square root!",
      },
      {
        mood: "RUSH",
        content:
          "Check divisibility from 2 to sqrt(num). If any divides evenly, it's not prime!",
      },
      {
        mood: "GRIND",
        content:
          "Optimize the algorithm! Only check up to square root. Handle edge cases: 1, 2, negative numbers.",
      },
    ],
    tests: [
      {
        input: [17],
        expected: true,
        description: "isPrime(17) should return true",
        order: 0,
      },
      {
        input: [4],
        expected: false,
        description: "isPrime(4) should return false",
        order: 1,
      },
      {
        input: [2],
        expected: true,
        description: "isPrime(2) should return true",
        order: 2,
      },
      {
        input: [1],
        expected: false,
        description: "isPrime(1) should return false",
        order: 3,
      },
    ],
  },
  {
    slug: "flatten-array",
    title: "Flatten Nested Array",
    description:
      "Create a function that flattens a nested array into a single-level array.",
    difficulty: "HARD",
    type: "ARRAY",
    estimatedTime: "18 minutes",
    order: 15,
    starter: `function flattenArray(arr) {
  // Return a flattened version of the nested array
  
}`,
    solution: `function flattenArray(arr) {
  return arr.flat(Infinity);
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "The flat() method with Infinity parameter will flatten any level of nesting!",
      },
      {
        mood: "RUSH",
        content:
          "Modern solution: arr.flat(Infinity) handles all nesting levels instantly!",
      },
      {
        mood: "GRIND",
        content:
          "Learn flat() method and compare with recursive solutions. Understand depth parameters.",
      },
    ],
    tests: [
      {
        input: [[1, [2, [3, 4]], 5]],
        expected: [1, 2, 3, 4, 5],
        description:
          "flattenArray([1, [2, [3, 4]], 5]) should return [1, 2, 3, 4, 5]",
        order: 0,
      },
      {
        input: [
          [
            [1, 2],
            [3, 4],
          ],
        ],
        expected: [1, 2, 3, 4],
        description:
          "flattenArray([[1, 2], [3, 4]]) should return [1, 2, 3, 4]",
        order: 1,
      },
      {
        input: [[1, 2, 3]],
        expected: [1, 2, 3],
        description: "flattenArray([1, 2, 3]) should return [1, 2, 3]",
        order: 2,
      },
    ],
  },
  {
    slug: "object-property-sum",
    title: "Sum Object Properties",
    description: "Create a function that sums all numeric values in an object.",
    difficulty: "MEDIUM",
    type: "OBJECT",
    estimatedTime: "15 minutes",
    order: 16,
    starter: `function sumObjectValues(obj) {
  // Return the sum of all numeric values in the object
  
}`,
    solution: `function sumObjectValues(obj) {
  return Object.values(obj)
    .filter(value => typeof value === 'number')
    .reduce((sum, num) => sum + num, 0);
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Get object values, filter for numbers, then reduce to sum them up!",
      },
      {
        mood: "RUSH",
        content:
          "Object.values(), filter for numbers, reduce to sum. Chain those methods!",
      },
      {
        mood: "GRIND",
        content:
          "Practice object methods and array chaining. Handle different data types properly.",
      },
    ],
    tests: [
      {
        input: [{ a: 1, b: 2, c: "hello", d: 3 }],
        expected: 6,
        description:
          "sumObjectValues({a: 1, b: 2, c: 'hello', d: 3}) should return 6",
        order: 0,
      },
      {
        input: [{ x: 10, y: -5, z: true }],
        expected: 5,
        description: "sumObjectValues({x: 10, y: -5, z: true}) should return 5",
        order: 1,
      },
      {
        input: [{ name: "John", age: 30 }],
        expected: 30,
        description:
          "sumObjectValues({name: 'John', age: 30}) should return 30",
        order: 2,
      },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search Algorithm",
    description:
      "Implement binary search to find the index of a target value in a sorted array.",
    difficulty: "HARD",
    type: "ALGORITHM",
    estimatedTime: "25 minutes",
    order: 17,
    starter: `function binarySearch(arr, target) {
  // Return the index of target in sorted array, or -1 if not found
  
}`,
    solution: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Binary search cuts the search space in half each time. Compare middle element with target!",
      },
      {
        mood: "RUSH",
        content:
          "Efficient O(log n) search! Find middle, compare, adjust left/right boundaries.",
      },
      {
        mood: "GRIND",
        content:
          "Master this fundamental algorithm. Understand time complexity, edge cases, and why it's efficient.",
      },
    ],
    tests: [
      {
        input: [[1, 3, 5, 7, 9], 5],
        expected: 2,
        description: "binarySearch([1, 3, 5, 7, 9], 5) should return 2",
        order: 0,
      },
      {
        input: [[1, 3, 5, 7, 9], 6],
        expected: -1,
        description: "binarySearch([1, 3, 5, 7, 9], 6) should return -1",
        order: 1,
      },
      {
        input: [[2, 4, 6, 8, 10, 12], 2],
        expected: 0,
        description: "binarySearch([2, 4, 6, 8, 10, 12], 2) should return 0",
        order: 2,
      },
    ],
  },
  {
    slug: "deep-clone-object",
    title: "Deep Clone Object",
    description:
      "Create a function that creates a deep copy of an object (including nested objects).",
    difficulty: "HARD",
    type: "OBJECT",
    estimatedTime: "22 minutes",
    order: 18,
    starter: `function deepClone(obj) {
  // Return a deep copy of the object
  
}`,
    solution: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}`,
    moodAdaptations: [
      {
        mood: "CHILL",
        content:
          "Recursively copy each property. Handle arrays and objects differently from primitives!",
      },
      {
        mood: "RUSH",
        content:
          "Quick approach: JSON.parse(JSON.stringify(obj)) for simple cases, but learn the proper recursive way!",
      },
      {
        mood: "GRIND",
        content:
          "Master recursion and object manipulation. Handle edge cases: null, arrays, nested structures.",
      },
    ],
    tests: [
      {
        input: [{ a: 1, b: { c: 2 } }],
        expected: { a: 1, b: { c: 2 } },
        description: "deepClone({a: 1, b: {c: 2}}) should return a deep copy",
        order: 0,
      },
      {
        input: [{ arr: [1, 2, { nested: true }] }],
        expected: { arr: [1, 2, { nested: true }] },
        description:
          "deepClone({arr: [1, 2, {nested: true}]}) should return a deep copy",
        order: 1,
      },
      {
        input: [null],
        expected: null,
        description: "deepClone(null) should return null",
        order: 2,
      },
    ],
  },
];

export async function seedChallenges() {
  console.log("<1 Seeding challenges...");

  for (const challengeInfo of challengeData) {
    try {
      // Create the challenge
      const challenge = await prisma.challenge.create({
        data: {
          slug: challengeInfo.slug,
          title: challengeInfo.title,
          description: challengeInfo.description,
          difficulty: challengeInfo.difficulty,
          type: challengeInfo.type,
          estimatedTime: challengeInfo.estimatedTime,
          order: challengeInfo.order,
          starter: challengeInfo.starter,
          solution: challengeInfo.solution,
          published: true,
          isPremium: false,
          requiredPlan: "FREE",
        },
      });

      // Create mood adaptations
      for (const adaptation of challengeInfo.moodAdaptations) {
        await prisma.challengeMoodAdaptation.create({
          data: {
            challengeId: challenge.id,
            mood: adaptation.mood,
            content: adaptation.content,
          },
        });
      }

      // Create tests
      for (const test of challengeInfo.tests) {
        await prisma.challengeTest.create({
          data: {
            challengeId: challenge.id,
            input: test.input,
            expected: test.expected,
            description: test.description,
            order: test.order,
          },
        });
      }

      console.log(` Created challenge: ${challengeInfo.title}`);
    } catch (error) {
      console.error(
        `L Error creating challenge ${challengeInfo.title}:`,
        error
      );
    }
  }

  console.log("<� Challenge seeding completed!");
}
seedChallenges();
export default seedChallenges;
