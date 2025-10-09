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
 */
const dsaTutorials: TutorialSeedData[] = [
  {
    slug: "02-two-pointer-technique",
    title:
      "Master the Two-Pointer Technique: Solve Array Problems in O(n) Time",
    description:
      "Transform your array problem-solving skills from brute-force O(n²) to elegant O(n) solutions using the two-pointer technique",
    mdxFile: "data-structures/02-two-pointer-technique",
    difficulty: 3,
    order: 2,
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
    slug: "02-two-pointer-technique-quiz",
    title: "Two-Pointer Technique Quiz",
    tutorialSlug: "02-two-pointer-technique",
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
