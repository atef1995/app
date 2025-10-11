import { PrismaClient } from "@prisma/client";
import {
  seedTutorials,
  seedQuizzes,
  TutorialSeedData,
  QuizSeedData,
} from "./utils/seedTutorialHelpers";

const prisma = new PrismaClient();

/**
 * Data Structures & Algorithms Tutorials
 * Category: data-structures
 *
 * Linear Teaching Approach:
 * 00 → What Are Algorithms? (Foundation)
 * 01 → Introduction to Arrays (Data Structure)
 * 02 → Why Sorting Matters (Motivation)
 * 03 → Simple Sorting Algorithms (Implementation)
 * 04 → Time Complexity & Big O (Analysis)
 * 05 → Two-Pointer Technique (Optimization)
 */
const dsaTutorials: TutorialSeedData[] = [
  {
    slug: "00-what-are-algorithms",
    title: "What Are Algorithms? Your First Step Into Programming Logic",
    description:
      "Learn what algorithms are through everyday examples, build your first algorithm in 5 minutes, and understand the foundation of all programming",
    mdxFile: "data-structures/00-what-are-algorithms",
    difficulty: 1,
    order: 0,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 20.0,
  },
  {
    slug: "01-introduction-to-arrays",
    title: "Introduction to Arrays: The Foundation of Data Structures",
    description:
      "Master arrays - the most fundamental data structure in programming. Learn creation, manipulation, and common patterns with real-world examples",
    mdxFile: "data-structures/01-introduction-to-arrays",
    difficulty: 2,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 25.0,
  },
  {
    slug: "02-why-sorting-matters",
    title: "Why Sorting Matters: The Secret to 700x Faster Search",
    description:
      "Discover why sorting is one of the most important concepts in programming. See how it makes search 700x faster with real-world examples from Google, Instagram, and e-commerce",
    mdxFile: "data-structures/02-why-sorting-matters",
    difficulty: 2,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 15.0,
  },
  {
    slug: "03-simple-sorting-algorithms",
    title: "Simple Sorting Algorithms: Bubble Sort & Selection Sort",
    description:
      "Learn how sorting algorithms work by implementing Bubble Sort and Selection Sort. Watch them in action with interactive visualizations and understand which algorithm is more efficient",
    mdxFile: "data-structures/03-simple-sorting-algorithms",
    difficulty: 2,
    order: 3,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 25.0,
  },
  {
    slug: "04-time-complexity-big-o",
    title:
      "Understanding Time Complexity: Your Secret Weapon for Coding Interviews",
    description:
      "Master Big O notation and time complexity analysis - the foundation for writing efficient code and acing technical interviews",
    mdxFile: "data-structures/04-time-complexity-big-o",
    difficulty: 3,
    order: 4,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 30.0,
  },
  {
    slug: "05-two-pointer-technique",
    title:
      "Master the Two-Pointer Technique: Solve Array Problems in O(n) Time",
    description:
      "Transform your array problem-solving skills from brute-force O(n²) to elegant O(n) solutions using the two-pointer technique",
    mdxFile: "data-structures/05-two-pointer-technique",
    difficulty: 3,
    order: 5,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    estimatedTime: 30.0,
  },
];

/**
 * DSA Tutorial Quizzes
 */
const dsaQuizzes: QuizSeedData[] = [
  {
    slug: "00-what-are-algorithms-quiz",
    title: "What Are Algorithms? Quiz",
    tutorialSlug: "00-what-are-algorithms",
    isPremium: false,
    requiredPlan: "FREE",
    questions: [
      {
        id: "algo-1",
        question: "What is an algorithm?",
        type: "multiple-choice",
        options: [
          "A programming language",
          "A step-by-step procedure to solve a problem",
          "A type of computer",
          "A software application",
        ],
        correct: 1,
        explanation:
          "An algorithm is a step-by-step procedure or set of instructions to solve a problem or complete a task. It's like a recipe that can be followed to achieve a specific result.",
      },
      {
        id: "algo-2",
        question:
          "Which of these everyday activities is an example of an algorithm?",
        type: "multiple-choice",
        options: [
          "Making a sandwich",
          "Sleeping",
          "Thinking randomly",
          "Feeling emotions",
        ],
        correct: 0,
        explanation:
          "Making a sandwich follows a clear sequence of steps (algorithm): get bread, add ingredients, close sandwich. Sleeping and feeling emotions aren't step-by-step procedures.",
      },
      {
        id: "algo-3",
        question: "What are the key characteristics of a good algorithm?",
        type: "multiple-choice",
        options: [
          "Long and complex",
          "Uses fancy words",
          "Clear, finite, and produces correct output",
          "Only works on expensive computers",
        ],
        correct: 2,
        explanation:
          "Good algorithms are: Clear (easy to understand), Finite (eventually ends), Correct (produces right output), Efficient (doesn't waste resources), and Robust (handles edge cases).",
      },
      {
        id: "algo-4",
        question: "What does 'finite' mean when describing an algorithm?",
        type: "multiple-choice",
        options: [
          "It uses finite memory",
          "It must eventually terminate/end",
          "It works with finite numbers only",
          "It has a finite number of lines of code",
        ],
        correct: 1,
        explanation:
          "Finite means the algorithm must eventually stop - it can't run forever. An infinite loop is not a valid algorithm because it never completes the task.",
      },
      {
        id: "algo-5",
        question:
          "In the FizzBuzz algorithm, what should you output for the number 15?",
        type: "multiple-choice",
        options: ["Fizz", "Buzz", "FizzBuzz", "15"],
        correct: 2,
        explanation:
          "15 is divisible by both 3 and 5, so it outputs 'FizzBuzz'. The algorithm checks: if divisible by 3 and 5 → FizzBuzz, if divisible by 3 → Fizz, if divisible by 5 → Buzz, else → the number.",
      },
      {
        id: "algo-6",
        question: "Why do we write algorithms before coding?",
        type: "multiple-choice",
        options: [
          "To make work take longer",
          "To plan our solution and catch problems early",
          "Because it's required by law",
          "To confuse ourselves",
        ],
        correct: 1,
        explanation:
          "Writing algorithms first helps us think through the problem logically, spot potential issues before coding, and communicate our solution clearly. It saves time in the long run.",
      },
      {
        id: "algo-7",
        question: "What is pseudocode?",
        type: "multiple-choice",
        options: [
          "Fake code that doesn't work",
          "Code written in Python only",
          "Plain language description of algorithm logic",
          "A type of encryption",
        ],
        correct: 2,
        explanation:
          "Pseudocode is a plain-language way to describe an algorithm's logic without worrying about specific programming syntax. It helps you focus on the steps before implementation.",
      },
      {
        id: "algo-8",
        question:
          "Which characteristic is NOT essential for a good algorithm?",
        type: "multiple-choice",
        options: [
          "Being written in a specific programming language",
          "Producing correct output",
          "Having clear, unambiguous steps",
          "Eventually terminating",
        ],
        correct: 0,
        explanation:
          "Algorithms are language-independent - the same algorithm can be implemented in any programming language. What matters is the logic and steps, not the language used.",
      },
      {
        id: "algo-9",
        question: "What makes an algorithm 'efficient'?",
        type: "multiple-choice",
        options: [
          "It has the most lines of code",
          "It uses the least time and resources to solve the problem",
          "It was written quickly",
          "It looks impressive",
        ],
        correct: 1,
        explanation:
          "An efficient algorithm solves the problem using minimal time and resources (memory, CPU). Two algorithms might both be correct, but one could be much faster or use less memory.",
      },
      {
        id: "algo-10",
        question:
          "Why is it important for algorithms to handle 'edge cases'?",
        type: "multiple-choice",
        options: [
          "To make code longer",
          "Edge cases don't matter",
          "To ensure the algorithm works correctly in unusual situations",
          "To confuse other programmers",
        ],
        correct: 2,
        explanation:
          "Edge cases are unusual or extreme inputs (like empty arrays, negative numbers, or very large values). Good algorithms handle these gracefully instead of crashing or giving wrong answers.",
      },
    ],
  },
  {
    slug: "01-introduction-to-arrays-quiz",
    title: "Introduction to Arrays Quiz",
    tutorialSlug: "01-introduction-to-arrays",
    isPremium: false,
    requiredPlan: "FREE",
    questions: [
      {
        id: "array-1",
        question: "What is an array in JavaScript?",
        type: "multiple-choice",
        options: [
          "A single value",
          "An ordered collection that can hold multiple values",
          "A function",
          "A loop",
        ],
        correct: 1,
        explanation:
          "An array is an ordered collection (list) that can store multiple values of any type. Each value has a position (index) starting from 0.",
      },
      {
        id: "array-2",
        question: "What index does the first element in an array have?",
        type: "multiple-choice",
        options: ["1", "0", "-1", "It depends"],
        correct: 1,
        explanation:
          "Arrays in JavaScript (and most programming languages) are zero-indexed, meaning the first element is at index 0, second at index 1, and so on.",
      },
      {
        id: "array-3",
        question:
          "Which method adds an element to the END of an array?",
        type: "multiple-choice",
        options: ["shift()", "unshift()", "push()", "pop()"],
        correct: 2,
        explanation:
          "push() adds elements to the end of an array. pop() removes from end, unshift() adds to beginning, shift() removes from beginning.",
      },
      {
        id: "array-4",
        question: "What does the map() method return?",
        type: "multiple-choice",
        options: [
          "Nothing (undefined)",
          "The original array modified",
          "A new array with transformed elements",
          "A single value",
        ],
        correct: 2,
        explanation:
          "map() returns a NEW array with each element transformed by the callback function. The original array remains unchanged.",
      },
      {
        id: "array-5",
        question: "When should you use filter() instead of map()?",
        type: "multiple-choice",
        options: [
          "When you want to transform each element",
          "When you want to select specific elements based on a condition",
          "When you want to combine elements",
          "When you want to sort elements",
        ],
        correct: 1,
        explanation:
          "Use filter() when you want to select only elements that meet certain criteria. It returns a new array containing only elements that pass the test function.",
      },
      {
        id: "array-6",
        question: "What does reduce() do?",
        type: "multiple-choice",
        options: [
          "Makes the array smaller",
          "Combines all array elements into a single value",
          "Removes duplicate elements",
          "Sorts the array",
        ],
        correct: 1,
        explanation:
          "reduce() combines/reduces all array elements into a single value by applying a function cumulatively. Common uses: sum numbers, count occurrences, group objects.",
      },
      {
        id: "array-7",
        question:
          "What's wrong with this code?\nconst doubled = numbers.map(num => { num * 2 });",
        type: "multiple-choice",
        options: [
          "Nothing, it works fine",
          "Missing return statement",
          "Should use forEach instead",
          "Syntax error in arrow function",
        ],
        correct: 1,
        explanation:
          "Without 'return', the arrow function with curly braces returns undefined. Either add 'return num * 2' or use implicit return: 'num => num * 2' without braces.",
      },
      {
        id: "array-8",
        question:
          "Which method should you use for side effects (like console.log)?",
        type: "multiple-choice",
        options: ["map()", "filter()", "forEach()", "reduce()"],
        correct: 2,
        explanation:
          "forEach() is designed for side effects (operations that don't return a value like logging, making API calls). Don't use map() for side effects as it creates an unnecessary array.",
      },
      {
        id: "array-9",
        question:
          "What happens when you chain array methods?\narray.filter().map().reduce()",
        type: "multiple-choice",
        options: [
          "Error - can't chain methods",
          "Only the last method runs",
          "Each method processes the result of the previous one",
          "They run in random order",
        ],
        correct: 2,
        explanation:
          "Method chaining means each method's output becomes the input for the next. The array is filtered, then the filtered result is mapped, then the mapped result is reduced.",
      },
      {
        id: "array-10",
        question:
          "Which is more efficient for finding a single item: find() or filter()?",
        type: "multiple-choice",
        options: [
          "filter() because it returns an array",
          "find() because it stops at the first match",
          "They're equally efficient",
          "Neither - use forEach()",
        ],
        correct: 1,
        explanation:
          "find() is more efficient because it stops searching as soon as it finds the first match. filter() continues through the entire array even after finding matches.",
      },
      {
        id: "array-11",
        question: "What does slice(1, 3) return for array [0, 1, 2, 3, 4]?",
        type: "multiple-choice",
        options: [
          "[1, 2, 3]",
          "[1, 2]",
          "[0, 1, 2]",
          "[2, 3]",
        ],
        correct: 1,
        explanation:
          "slice(start, end) returns elements from index start up to (but NOT including) index end. So slice(1, 3) returns [1, 2] - elements at indices 1 and 2.",
      },
      {
        id: "array-12",
        question: "What's the difference between slice() and splice()?",
        type: "multiple-choice",
        options: [
          "No difference, same method",
          "slice() copies, splice() modifies original array",
          "splice() copies, slice() modifies original array",
          "Both modify the original array",
        ],
        correct: 1,
        explanation:
          "slice() creates a copy without modifying original (non-mutating). splice() actually modifies the original array by adding/removing elements (mutating).",
      },
      {
        id: "array-13",
        question:
          "How do you remove duplicates from an array [1, 2, 2, 3]?",
        type: "multiple-choice",
        options: [
          "[...new Set(array)]",
          "array.unique()",
          "array.removeDuplicates()",
          "array.distinct()",
        ],
        correct: 0,
        explanation:
          "Use [...new Set(array)] - Set automatically removes duplicates, then spread operator converts it back to an array. JavaScript has no built-in unique() method.",
      },
      {
        id: "array-14",
        question: "What does includes() return?",
        type: "multiple-choice",
        options: [
          "The index of the element",
          "The element itself",
          "A boolean (true/false)",
          "A new array",
        ],
        correct: 2,
        explanation:
          "includes() returns a boolean - true if the element exists in the array, false if it doesn't. Use indexOf() if you need the position.",
      },
      {
        id: "array-15",
        question:
          "Why is this approach inefficient?\nfor (let i = 0; i < arr.length; i++) {\n  if (arr.includes(target)) {...}\n}",
        type: "multiple-choice",
        options: [
          "includes() is slow",
          "includes() inside a loop makes it O(n²)",
          "for loops are outdated",
          "Nothing wrong with it",
        ],
        correct: 1,
        explanation:
          "includes() is O(n) by itself. Inside an O(n) loop, you get O(n²) - quadratic time. For large arrays, this gets slow fast. Move includes() outside the loop when possible.",
      },
    ],
  },
  {
    slug: "02-why-sorting-matters-quiz",
    title: "Why Sorting Matters Quiz",
    tutorialSlug: "02-why-sorting-matters",
    isPremium: false,
    requiredPlan: "FREE",
    questions: [
      {
        id: "sort-why-1",
        question:
          "How much faster can binary search be compared to linear search on 10,000 items?",
        type: "multiple-choice",
        options: [
          "2x faster",
          "10x faster",
          "357x faster",
          "The same speed",
        ],
        correct: 2,
        explanation:
          "With 10,000 items, linear search averages 5,000 checks while binary search takes only 14 checks, making it approximately 357x faster. This dramatic speedup is why sorting enables faster searching.",
      },
      {
        id: "sort-why-2",
        question: "What is the main reason sorting makes search faster?",
        type: "multiple-choice",
        options: [
          "Sorting makes the data smaller",
          "Sorted data has structure that allows eliminating half the search space each step",
          "Sorting removes duplicates",
          "Sorted arrays use less memory",
        ],
        correct: 1,
        explanation:
          "Sorting creates structure in the data. With sorted data, you can use algorithms like binary search that eliminate half the remaining items with each comparison, dramatically reducing search time.",
      },
      {
        id: "sort-why-3",
        question:
          "In a sorted array, binary search checks how many items for 1,000,000 names?",
        type: "multiple-choice",
        options: [
          "About 20 items",
          "About 500,000 items",
          "All 1,000,000 items",
          "About 1,000 items",
        ],
        correct: 0,
        explanation:
          "Binary search on 1,000,000 items requires only about 20 checks (log₂(1,000,000) ≈ 20). This is why Google can search billions of web pages in milliseconds.",
      },
      {
        id: "sort-why-4",
        question:
          "When should you definitely use sorting before searching?",
        type: "multiple-choice",
        options: [
          "When searching only once",
          "When searching the data repeatedly",
          "When the data changes frequently",
          "When you only need to find the maximum value",
        ],
        correct: 1,
        explanation:
          "Sorting has an upfront cost, but pays off when you search repeatedly. The initial sort cost is amortized across many fast searches, making the overall operation much more efficient.",
      },
      {
        id: "sort-why-5",
        question:
          "Why does Instagram sort your feed by timestamp?",
        type: "multiple-choice",
        options: [
          "To make the feed look prettier",
          "To show newest posts first for better user experience",
          "Because it's required by law",
          "To use more server resources",
        ],
        correct: 1,
        explanation:
          "Sorting by timestamp (newest first) provides the best user experience by showing fresh content first. This is a real-world application where sorting directly improves product value.",
      },
      {
        id: "sort-why-6",
        question:
          "In e-commerce, why do sites sort products by price?",
        type: "multiple-choice",
        options: [
          "To confuse customers",
          "To help customers find affordable options quickly, increasing conversions",
          "Because it's easier to code",
          "To hide expensive products",
        ],
        correct: 1,
        explanation:
          "Sorting by price (low to high or high to low) helps customers find what they can afford quickly, improving user experience and increasing sales conversions.",
      },
      {
        id: "sort-why-7",
        question:
          "What problem does sorting help solve efficiently?",
        type: "multiple-choice",
        options: [
          "Finding the maximum value",
          "Finding duplicate values",
          "Counting total elements",
          "Adding new elements",
        ],
        correct: 1,
        explanation:
          "After sorting, duplicates appear next to each other, making them trivial to find in O(n) time. Without sorting, finding all duplicates would require checking every pair - O(n²) time.",
      },
      {
        id: "sort-why-8",
        question:
          "When does sorting NOT help?",
        type: "multiple-choice",
        options: [
          "When you need to search repeatedly",
          "When you only search once",
          "When finding pairs",
          "When displaying ordered data",
        ],
        correct: 1,
        explanation:
          "If you only search once, the cost of sorting might not be worth it - a simple linear search could be faster overall. Sorting pays off when you perform multiple operations that benefit from order.",
      },
      {
        id: "sort-why-9",
        question:
          "What is the trade-off when using sorting?",
        type: "multiple-choice",
        options: [
          "Sorting requires more memory than the original data",
          "Sorting has an upfront time cost but enables faster subsequent operations",
          "Sorting makes the code harder to read",
          "Sorting removes some data",
        ],
        correct: 1,
        explanation:
          "The key trade-off is upfront sorting cost vs. faster subsequent operations. For 10,000 items, sorting takes ~140,000 operations, but if you search more than 30 times, you break even and save time overall.",
      },
      {
        id: "sort-why-10",
        question:
          "How does Google search billions of pages in milliseconds?",
        type: "multiple-choice",
        options: [
          "By checking every page for each search",
          "By maintaining sorted indexes that enable binary search",
          "By caching every possible search query",
          "By using quantum computers",
        ],
        correct: 1,
        explanation:
          "Google maintains massive sorted indexes (by relevance, keywords, etc.) that enable binary search and other efficient lookup algorithms, turning what would take hours into milliseconds.",
      },
      {
        id: "sort-why-11",
        question:
          "Why is finding closest pairs easier in a sorted array?",
        type: "multiple-choice",
        options: [
          "Because closest values appear next to each other after sorting",
          "Because sorting makes numbers smaller",
          "Because you can use binary search",
          "It's not actually easier",
        ],
        correct: 0,
        explanation:
          "In a sorted array, the closest values are adjacent. You only need one pass comparing neighbors - O(n). Without sorting, you'd need to check all pairs - O(n²).",
      },
      {
        id: "sort-why-12",
        question:
          "What is the SmartSearchFilter pattern's key optimization?",
        type: "multiple-choice",
        options: [
          "Sorting on every search",
          "Never sorting the data",
          "Lazy sorting - only sort once when first needed",
          "Using multiple sorts for accuracy",
        ],
        correct: 2,
        explanation:
          "Lazy sorting means you only sort the data once, when it's first needed, then reuse that sorted data for all subsequent searches. This optimizes the common case of multiple searches.",
      },
      {
        id: "sort-why-13",
        question:
          "Why shouldn't you always sort everything?",
        type: "multiple-choice",
        options: [
          "Sorting is always beneficial",
          "Sorting has a cost and doesn't help for operations like finding max/min",
          "Sorting corrupts the data",
          "Sorted arrays use more memory",
        ],
        correct: 1,
        explanation:
          "Sorting has a time cost and doesn't help every operation. For finding max/min, a simple O(n) scan is faster than O(n log n) sorting. Only sort when it provides clear benefits for your use case.",
      },
      {
        id: "sort-why-14",
        question:
          "What happens when you use sorting on frequently changing data?",
        type: "multiple-choice",
        options: [
          "Perfect - sorting works best with dynamic data",
          "The constant re-sorting becomes expensive",
          "Sorting prevents changes",
          "Data becomes corrupted",
        ],
        correct: 1,
        explanation:
          "If data changes frequently, you must re-sort often, making the constant sorting cost expensive. For highly dynamic data, consider specialized data structures like heaps or balanced trees instead.",
      },
      {
        id: "sort-why-15",
        question:
          "In a game leaderboard, why is sorting essential?",
        type: "multiple-choice",
        options: [
          "To hide player scores",
          "To display players in rank order from highest to lowest score",
          "Sorting isn't needed for leaderboards",
          "To make the game harder",
        ],
        correct: 1,
        explanation:
          "Leaderboards need to display players in rank order by score. Sorting by score (descending) is essential for showing who's #1, #2, #3, etc. This is a case where sorted display is the primary goal.",
      },
    ],
  },
  {
    slug: "03-simple-sorting-algorithms-quiz",
    title: "Simple Sorting Algorithms Quiz",
    tutorialSlug: "03-simple-sorting-algorithms",
    isPremium: false,
    requiredPlan: "FREE",
    questions: [
      {
        id: "simple-sort-1",
        question: "How does Bubble Sort get its name?",
        type: "multiple-choice",
        options: [
          "Because it creates bubbles in memory",
          "Because larger values 'bubble up' to the end with each pass",
          "Because it was invented by someone named Bubble",
          "Because it's a bubbly, fun algorithm",
        ],
        correct: 1,
        explanation:
          "Bubble Sort gets its name because larger values gradually 'bubble up' to their correct position at the end of the array through repeated swaps with adjacent elements.",
      },
      {
        id: "simple-sort-2",
        question: "What is the main operation in Bubble Sort?",
        type: "multiple-choice",
        options: [
          "Finding the minimum element",
          "Swapping adjacent elements if they're in wrong order",
          "Dividing the array in half",
          "Removing duplicate elements",
        ],
        correct: 1,
        explanation:
          "Bubble Sort repeatedly compares adjacent elements and swaps them if they're in the wrong order. This process continues until no more swaps are needed.",
      },
      {
        id: "simple-sort-3",
        question:
          "After the first pass of Bubble Sort on [64, 34, 25, 12, 22, 11, 90], where is the largest element?",
        type: "multiple-choice",
        options: [
          "At index 0 (beginning)",
          "At index 6 (end)",
          "Still at its original position",
          "In the middle somewhere",
        ],
        correct: 1,
        explanation:
          "After each pass of Bubble Sort, the largest unsorted element 'bubbles' to its final position at the end. So after the first pass, 90 is guaranteed to be at the last position.",
      },
      {
        id: "simple-sort-4",
        question:
          "What optimization can make Bubble Sort efficient for nearly-sorted data?",
        type: "multiple-choice",
        options: [
          "Using a faster computer",
          "Adding a flag to detect when no swaps occur",
          "Sorting only half the array",
          "Using binary search",
        ],
        correct: 1,
        explanation:
          "By tracking whether any swaps occurred in a pass, you can exit early if no swaps happen - meaning the array is already sorted. This makes Bubble Sort O(n) for nearly-sorted data.",
      },
      {
        id: "simple-sort-5",
        question: "How many swaps does Bubble Sort make in the worst case for 10 elements?",
        type: "multiple-choice",
        options: ["10 swaps", "45 swaps", "100 swaps", "9 swaps"],
        correct: 1,
        explanation:
          "In the worst case (reverse sorted array), Bubble Sort makes approximately n²/2 swaps. For 10 elements, that's about 45 swaps - one for nearly every comparison.",
      },
      {
        id: "simple-sort-6",
        question: "What is Selection Sort's core strategy?",
        type: "multiple-choice",
        options: [
          "Swap adjacent elements repeatedly",
          "Find the minimum element in unsorted portion and swap it to the front",
          "Divide the array and conquer",
          "Insert elements one at a time",
        ],
        correct: 1,
        explanation:
          "Selection Sort finds the minimum element in the unsorted portion, then swaps it with the first unsorted element. This gradually builds a sorted portion at the beginning.",
      },
      {
        id: "simple-sort-7",
        question:
          "In Selection Sort, what does the sorted/unsorted boundary represent?",
        type: "multiple-choice",
        options: [
          "The middle of the array",
          "The dividing line between sorted (left) and unsorted (right) portions",
          "The largest element",
          "An error in the algorithm",
        ],
        correct: 1,
        explanation:
          "Selection Sort maintains a boundary where everything to the left is sorted and everything to the right is unsorted. This boundary moves right with each pass.",
      },
      {
        id: "simple-sort-8",
        question: "How many swaps does Selection Sort make for an array of N elements?",
        type: "multiple-choice",
        options: [
          "N² swaps",
          "N/2 swaps",
          "Exactly N-1 swaps",
          "It depends on the input",
        ],
        correct: 2,
        explanation:
          "Selection Sort always makes exactly N-1 swaps (one per pass), regardless of the input. This is its key advantage - predictable, minimal swaps even in worst case.",
      },
      {
        id: "simple-sort-9",
        question:
          "Why might Selection Sort be preferred for sorting data on Flash memory?",
        type: "multiple-choice",
        options: [
          "It's faster than other algorithms",
          "Flash memory has limited write cycles, and Selection Sort minimizes swaps",
          "Selection Sort uses less memory",
          "Flash memory requires Selection Sort specifically",
        ],
        correct: 1,
        explanation:
          "Flash memory has limited write cycles. Selection Sort makes only N-1 swaps compared to Bubble Sort's up to N² swaps, significantly reducing writes and extending Flash memory lifespan.",
      },
      {
        id: "simple-sort-10",
        question:
          "What is the time complexity of both Bubble Sort and Selection Sort?",
        type: "multiple-choice",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correct: 2,
        explanation:
          "Both algorithms have O(n²) time complexity because they use nested loops - for each of n elements, they check up to n other elements. This quadratic growth makes them slow for large datasets.",
      },
      {
        id: "simple-sort-11",
        question: "Which statement about Bubble Sort vs Selection Sort is TRUE?",
        type: "multiple-choice",
        options: [
          "Bubble Sort makes fewer swaps than Selection Sort",
          "Selection Sort makes fewer swaps than Bubble Sort",
          "Both make the same number of swaps",
          "Selection Sort is always faster",
        ],
        correct: 1,
        explanation:
          "Selection Sort makes exactly N-1 swaps while Bubble Sort can make up to N²/2 swaps. This is Selection Sort's key advantage, though both have the same time complexity.",
      },
      {
        id: "simple-sort-12",
        question: "What does it mean that Bubble Sort is 'stable'?",
        type: "multiple-choice",
        options: [
          "It never crashes",
          "It preserves the relative order of equal elements",
          "It always runs at the same speed",
          "It works on all data types",
        ],
        correct: 1,
        explanation:
          "A stable sort preserves the original order of elements with equal values. Bubble Sort is stable because it only swaps adjacent elements when strictly greater. Selection Sort is not stable.",
      },
      {
        id: "simple-sort-13",
        question:
          "For a nearly-sorted array [1, 2, 3, 5, 4], which algorithm is better?",
        type: "multiple-choice",
        options: [
          "Selection Sort - always predictable",
          "Optimized Bubble Sort - can exit after one pass",
          "Both are equally good",
          "Neither - use a different algorithm",
        ],
        correct: 1,
        explanation:
          "Optimized Bubble Sort with early exit flag can detect the array is nearly sorted and finish in O(n) time. Selection Sort always does O(n²) comparisons regardless of input.",
      },
      {
        id: "simple-sort-14",
        question: "What is a common mistake when implementing Bubble Sort?",
        type: "multiple-choice",
        options: [
          "Using too many variables",
          "Off-by-one errors causing array out-of-bounds access",
          "Making it too fast",
          "Not using enough memory",
        ],
        correct: 1,
        explanation:
          "The most common mistake is using 'i < n' instead of 'i < n - 1' in the loop, causing access to arr[i+1] when i equals n-1, which is out of bounds (arr[n] doesn't exist).",
      },
      {
        id: "simple-sort-15",
        question:
          "When building a game leaderboard that needs only the top 10 players, which approach is most efficient?",
        type: "multiple-choice",
        options: [
          "Bubble Sort the entire array",
          "Selection Sort but only do 10 passes (partial sort)",
          "Sort the entire array with any algorithm",
          "Don't sort at all",
        ],
        correct: 1,
        explanation:
          "Partial Selection Sort is perfect here - only find and place the top 10 maximum values. You avoid sorting the entire array, making it efficient for 'top K' problems with minimal swaps.",
      },
    ],
  },
  {
    slug: "04-time-complexity-big-o-quiz",
    title: "Time Complexity & Big O Notation Quiz",
    tutorialSlug: "04-time-complexity-big-o",
    isPremium: false,
    requiredPlan: "FREE",
    questions: [
      {
        id: "big-o-1",
        question: "What does Big O notation measure?",
        type: "multiple-choice",
        options: [
          "The exact execution time of an algorithm",
          "How runtime grows as input size increases",
          "The amount of code written",
          "The number of variables used",
        ],
        correct: 1,
        explanation:
          "Big O notation describes how an algorithm's runtime or space requirements grow relative to input size, ignoring constants and focusing on growth rate.",
      },
      {
        id: "big-o-2",
        question:
          "What is the time complexity of accessing an element in an array by index?",
        type: "multiple-choice",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correct: 2,
        explanation:
          "Array access by index is O(1) - constant time. It takes the same amount of time regardless of array size because arrays store elements in contiguous memory.",
      },
      {
        id: "big-o-3",
        question: "Which complexity is fastest for large inputs?",
        type: "multiple-choice",
        options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
        correct: 2,
        explanation:
          "O(log n) is the fastest among these options. Logarithmic time grows very slowly - even with 1 million items, it only requires about 20 operations.",
      },
      {
        id: "big-o-4",
        question:
          "What is the time complexity of this code?\n\nfor (let i = 0; i < n; i++) {\n  console.log(i);\n}\nfor (let j = 0; j < n; j++) {\n  console.log(j);\n}",
        type: "multiple-choice",
        options: ["O(n)", "O(n²)", "O(2n)", "O(log n)"],
        correct: 0,
        explanation:
          "Two sequential (non-nested) loops are O(n) + O(n) = O(2n), which simplifies to O(n) because we drop constants in Big O notation.",
      },
      {
        id: "big-o-5",
        question:
          "What is the time complexity of nested loops?\n\nfor (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    console.log(i, j);\n  }\n}",
        type: "multiple-choice",
        options: ["O(n)", "O(n²)", "O(2n)", "O(log n)"],
        correct: 1,
        explanation:
          "Nested loops where both iterate n times result in O(n²) - quadratic time. The inner loop runs n times for each of n iterations of the outer loop.",
      },
      {
        id: "big-o-6",
        question:
          "What is the space complexity of this function?\n\nfunction double(arr) {\n  const result = [];\n  for (let num of arr) {\n    result.push(num * 2);\n  }\n  return result;\n}",
        type: "multiple-choice",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 2,
        explanation:
          "Space complexity is O(n) because we create a new array 'result' that grows proportionally with the input array size.",
      },
      {
        id: "big-o-7",
        question: "Why do we drop constants in Big O notation?",
        type: "multiple-choice",
        options: [
          "To make the math easier",
          "Because we focus on growth rate, not exact time",
          "Constants don't matter at all",
          "To confuse beginners",
        ],
        correct: 1,
        explanation:
          "We drop constants because Big O focuses on how algorithms scale with input size, not exact runtime. O(2n) and O(n) have the same growth rate - both are linear.",
      },
      {
        id: "big-o-8",
        question: "What is the time complexity of binary search?",
        type: "multiple-choice",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correct: 2,
        explanation:
          "Binary search is O(log n) because it cuts the search space in half with each step. For 1000 items, it needs only ~10 comparisons (log₂(1000) ≈ 10).",
      },
      {
        id: "big-o-9",
        question: "Which scenario represents O(n²) complexity?",
        type: "multiple-choice",
        options: [
          "Searching through a sorted array",
          "Checking all pairs of elements in an array",
          "Adding an element to the end of an array",
          "Finding the maximum value in an array",
        ],
        correct: 1,
        explanation:
          "Checking all pairs requires nested loops - for each element, check it against all other elements. This is the classic O(n²) pattern.",
      },
      {
        id: "big-o-10",
        question:
          "What is the complexity of this code?\n\nfunction example(arr) {\n  return arr[0] + arr[arr.length - 1];\n}",
        type: "multiple-choice",
        options: ["O(n)", "O(1)", "O(2)", "O(log n)"],
        correct: 1,
        explanation:
          "This is O(1) - constant time. It performs exactly 3 operations (two array accesses and one addition) regardless of array size.",
      },
      {
        id: "big-o-11",
        question: "If an algorithm is O(n² + n), what do we simplify it to?",
        type: "multiple-choice",
        options: ["O(n² + n)", "O(n²)", "O(n)", "O(2n²)"],
        correct: 1,
        explanation:
          "We drop lower order terms, so O(n² + n) becomes O(n²). When n is large, n² dominates completely (e.g., 1000² = 1,000,000 vs 1000).",
      },
      {
        id: "big-o-12",
        question:
          "What is the time complexity of the naive recursive Fibonacci?",
        type: "multiple-choice",
        options: ["O(n)", "O(log n)", "O(2ⁿ)", "O(n²)"],
        correct: 2,
        explanation:
          "Recursive Fibonacci without memoization is O(2ⁿ) - exponential time. Each call makes 2 more calls, creating an exponential tree of function calls.",
      },
      {
        id: "big-o-13",
        question: "What does O(1) space complexity mean?",
        type: "multiple-choice",
        options: [
          "Uses exactly 1 byte of memory",
          "Uses no memory at all",
          "Uses constant memory regardless of input size",
          "Uses 1 variable only",
        ],
        correct: 2,
        explanation:
          "O(1) space means the algorithm uses a constant amount of memory that doesn't grow with input size - it could be 5 variables or 100, but it's fixed.",
      },
      {
        id: "big-o-14",
        question: "Which is better for large datasets: O(n log n) or O(n²)?",
        type: "multiple-choice",
        options: [
          "O(n²) because it's simpler",
          "O(n log n) because it grows slower",
          "They're the same",
          "It depends on the constants",
        ],
        correct: 1,
        explanation:
          "O(n log n) is significantly better for large inputs. With 1000 items: O(n log n) ≈ 10,000 operations vs O(n²) = 1,000,000 operations - a 100x difference!",
      },
      {
        id: "big-o-15",
        question:
          "What is the time complexity when you use .includes() inside a loop?\n\nfor (let i = 0; i < arr.length; i++) {\n  if (arr.includes(target)) { ... }\n}",
        type: "multiple-choice",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correct: 1,
        explanation:
          "This is O(n²) because .includes() is O(n) itself, and it's called inside an O(n) loop. Hidden complexity like this is a common mistake!",
      },
    ],
  },
  {
    slug: "05-two-pointer-technique-quiz",
    title: "Two-Pointer Technique Quiz",
    tutorialSlug: "05-two-pointer-technique",
    isPremium: false,
    requiredPlan: "FREE",
    questions: [
      {
        id: "two-pointer-1",
        question: "What is the main advantage of the two-pointer technique?",
        type: "multiple-choice",
        options: [
          "It uses more memory",
          "It reduces time complexity from O(n²) to O(n)",
          "It works with unsorted arrays",
          "It's easier to understand",
        ],
        correct: 1,
        explanation:
          "The two-pointer technique reduces time complexity from O(n²) (nested loops) to O(n) (single pass) by using two pointers that move intelligently through the array.",
      },
      {
        id: "two-pointer-2",
        question:
          "What is the key requirement for the basic two-pointer pair sum problem?",
        type: "multiple-choice",
        options: [
          "The array must be unsorted",
          "The array must be sorted",
          "The array must have duplicates",
          "The array must have odd length",
        ],
        correct: 1,
        explanation:
          "The two-pointer technique for pair sum requires a sorted array. The algorithm relies on the sorted order to decide whether to move the left pointer right (to increase sum) or right pointer left (to decrease sum).",
      },
      {
        id: "two-pointer-3",
        question:
          "In the two-pointer technique, when should you move the left pointer?",
        type: "multiple-choice",
        options: [
          "When the sum is greater than target",
          "When the sum is less than target",
          "When the sum equals target",
          "Randomly",
        ],
        correct: 1,
        explanation:
          "When the current sum is less than the target, we need a larger sum, so we move the left pointer right to include a larger value (in a sorted array).",
      },
      {
        id: "two-pointer-4",
        question: "What is the space complexity of the two-pointer technique?",
        type: "multiple-choice",
        options: ["O(n)", "O(n²)", "O(1)", "O(log n)"],
        correct: 2,
        explanation:
          "The two-pointer technique uses O(1) constant extra space - only two pointer variables regardless of input size.",
      },
      {
        id: "two-pointer-5",
        question:
          "Which problem pattern is NOT typically solved with two pointers?",
        type: "multiple-choice",
        options: [
          "Finding pairs with target sum",
          "Removing duplicates from sorted array",
          "Finding the maximum element",
          "Container with most water",
        ],
        correct: 2,
        explanation:
          "Finding the maximum element is a simple O(n) scan problem that doesn't benefit from two pointers. Two pointers are best for problems involving pairs, ranges, or comparing elements from different positions.",
      },
      {
        id: "two-pointer-6",
        question:
          "In the 'remove duplicates' problem, what do the two pointers represent?",
        type: "multiple-choice",
        options: [
          "Start and end of array",
          "Read position and write position",
          "Min and max values",
          "Duplicate and unique elements",
        ],
        correct: 1,
        explanation:
          "For removing duplicates, one pointer reads through the array, while the other marks the position to write unique elements - a classic same-direction two-pointer pattern.",
      },
      {
        id: "two-pointer-7",
        question: "What does the 'converging' two-pointer pattern mean?",
        type: "multiple-choice",
        options: [
          "Pointers move away from each other",
          "Pointers move toward each other from opposite ends",
          "Pointers move in the same direction",
          "Pointers swap positions",
        ],
        correct: 1,
        explanation:
          "Converging pointers start at opposite ends and move toward each other until they meet. This pattern is used in problems like pair sum and valid palindrome.",
      },
      {
        id: "two-pointer-8",
        question: "How would you extend two-pointer to solve the 3Sum problem?",
        type: "multiple-choice",
        options: [
          "Use three separate loops",
          "Fix one element and use two pointers for the remaining array",
          "Use three pointers simultaneously",
          "It cannot be solved with pointers",
        ],
        correct: 1,
        explanation:
          "3Sum is solved by fixing one element and using two pointers on the remaining array to find pairs that sum to -(fixed element). This reduces O(n³) to O(n²).",
      },
      {
        id: "two-pointer-9",
        question:
          "In the 'container with most water' problem, when do you move the left pointer?",
        type: "multiple-choice",
        options: [
          "When left height is less than right height",
          "When left height is greater than right height",
          "Always move left first",
          "When the container is full",
        ],
        correct: 0,
        explanation:
          "Move the pointer pointing to the shorter line, hoping to find a taller line that could increase area. If left < right, move left; otherwise move right.",
      },
      {
        id: "two-pointer-10",
        question:
          "What is a real-world use case for the two-pointer technique?",
        type: "multiple-choice",
        options: [
          "Sorting algorithms",
          "Hash table lookups",
          "Price range filtering in e-commerce",
          "Database indexing",
        ],
        correct: 2,
        explanation:
          "Two-pointer technique is perfect for price range filtering - finding products between min and max prices in a sorted list efficiently in O(n) time.",
      },
      {
        id: "two-pointer-11",
        question:
          "Why is two-pointer more efficient than using a hash map for pair sum?",
        type: "multiple-choice",
        options: [
          "It's faster",
          "It uses O(1) space instead of O(n)",
          "It's easier to code",
          "Hash maps don't work for this problem",
        ],
        correct: 1,
        explanation:
          "While both are O(n) time, two-pointer uses O(1) space (just two variables) versus hash map's O(n) space. However, two-pointer requires sorted array.",
      },
      {
        id: "two-pointer-12",
        question:
          "What happens if you use two pointers on an unsorted array for pair sum?",
        type: "multiple-choice",
        options: [
          "It still works correctly",
          "It may miss valid pairs",
          "It will crash",
          "It becomes faster",
        ],
        correct: 1,
        explanation:
          "On unsorted arrays, the two-pointer logic breaks down because we can't reliably determine which pointer to move. The algorithm may miss valid pairs or give incorrect results.",
      },
      {
        id: "two-pointer-13",
        question:
          "In a valid palindrome check, when do the pointers indicate it's NOT a palindrome?",
        type: "multiple-choice",
        options: [
          "When they cross each other",
          "When characters at pointer positions don't match",
          "When pointers reach the end",
          "When both pointers are equal",
        ],
        correct: 1,
        explanation:
          "If characters at the left and right pointer positions don't match at any point, the string is not a palindrome. Pointers converge from both ends comparing characters.",
      },
      {
        id: "two-pointer-14",
        question: "What is the time complexity of the two-pointer pair sum?",
        type: "multiple-choice",
        options: [
          "O(n log n) due to sorting requirement",
          "O(n) for the two-pointer traversal",
          "O(n²) for checking all pairs",
          "O(1) constant time",
        ],
        correct: 1,
        explanation:
          "The two-pointer traversal itself is O(n) - each element is visited at most once. If you need to sort first, total complexity becomes O(n log n) + O(n) = O(n log n).",
      },
      {
        id: "two-pointer-15",
        question: "Which variation uses pointers moving in the same direction?",
        type: "multiple-choice",
        options: [
          "Pair sum in sorted array",
          "Remove duplicates from sorted array",
          "Valid palindrome check",
          "Container with most water",
        ],
        correct: 1,
        explanation:
          "Remove duplicates uses same-direction pointers - both move left to right, but at different speeds (slow and fast pointer). The others use converging pointers from opposite ends.",
      },
    ],
  },
];

/**
 * Main seeding function for DSA tutorials
 */
export async function seedDsaTutorials() {
  console.log("🧠 Seeding Data Structures & Algorithms tutorials...");

  try {
    // // Find the category
    // const category = await prisma.category.findUnique({
    //   where: { slug: "data-structres" },
    // });
    // await prisma.tutorial.deleteMany({
    //   where: { categoryId: category?.id },
    // });
    // Seed tutorials
    await seedTutorials("data-structures", dsaTutorials, prisma);

    // Seed quizzes
    await seedQuizzes(dsaQuizzes, prisma);

    console.log("🎉 DSA tutorials and quizzes seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding DSA tutorials:", error);
    throw error;
  }
}

// Run if executed directly

seedDsaTutorials()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default seedDsaTutorials;
