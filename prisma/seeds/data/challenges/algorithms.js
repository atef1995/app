"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.algorithmChallenges = void 0;
exports.algorithmChallenges = [
    {
        id: "4",
        slug: "fibonacci-number",
        title: "Fibonacci Number",
        description: "Calculate the nth Fibonacci number",
        difficulty: "medium",
        type: "algorithm",
        estimatedTime: "20 minutes",
        isPremium: false,
        requiredPlan: "FREE",
        moodAdapted: {
            rush: "Time to unleash the math magic! 🔥 Let's calculate those Fibonacci numbers fast!",
            chill: "A beautiful mathematical sequence. Take your time to understand the pattern. 🌸",
            grind: "Practice recursive thinking and optimization techniques. Consider both recursive and iterative approaches.",
        },
        starter: "function fibonacci(n) {\n  // Write your solution here\n  \n}",
        solution: "function fibonacci(n) {\n  if (n <= 1) return n;\n  \n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}",
        tests: [
            {
                input: [0],
                expected: 0,
                description: "fibonacci(0) should return 0",
            },
            {
                input: [1],
                expected: 1,
                description: "fibonacci(1) should return 1",
            },
            {
                input: [5],
                expected: 5,
                description: "fibonacci(5) should return 5",
            },
            {
                input: [10],
                expected: 55,
                description: "fibonacci(10) should return 55",
            },
        ],
    },
    {
        id: "5",
        slug: "two-sum",
        title: "Two Sum",
        description: "Find two numbers in an array that add up to a target sum",
        difficulty: "medium",
        type: "algorithm",
        estimatedTime: "25 minutes",
        isPremium: true,
        requiredPlan: "VIBED",
        moodAdapted: {
            rush: "Hunt down those pairs! 🎯 Use that algorithmic speed to find the solution!",
            chill: "Think through the problem step by step. There's an elegant solution waiting. 🍃",
            grind: "Practice hash map optimization. Study time complexity trade-offs between brute force and optimized approaches.",
        },
        starter: "function twoSum(nums, target) {\n  // Write your solution here\n  // Return an array of the two indices\n  \n}",
        solution: "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  \n  return [];\n}",
        tests: [
            {
                input: [[2, 7, 11, 15], 9],
                expected: [0, 1],
                description: "twoSum([2, 7, 11, 15], 9) should return [0, 1]",
            },
            {
                input: [[3, 2, 4], 6],
                expected: [1, 2],
                description: "twoSum([3, 2, 4], 6) should return [1, 2]",
            },
            {
                input: [[3, 3], 6],
                expected: [0, 1],
                description: "twoSum([3, 3], 6) should return [0, 1]",
            },
        ],
    },
];
