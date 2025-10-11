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
