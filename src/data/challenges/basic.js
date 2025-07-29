"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicChallenges = void 0;
exports.basicChallenges = [
    {
        id: "1",
        slug: "sum-of-two-numbers",
        title: "Sum of Two Numbers",
        description: "Write a function that returns the sum of two numbers",
        difficulty: "easy",
        type: "function",
        estimatedTime: "5 minutes",
        isPremium: false,
        requiredPlan: "FREE",
        moodAdapted: {
            rush: "Let's crush this basic challenge! 💪 Show that computer who's boss!",
            chill: "Take your time with this gentle warm-up. No rush, just enjoy the coding flow. 🌊",
            grind: "A fundamental building block. Master this pattern - it's the foundation for more complex logic.",
        },
        starter: "function addNumbers(a, b) {\n  // Write your solution here\n  \n}",
        solution: "function addNumbers(a, b) {\n  return a + b;\n}",
        tests: [
            {
                input: [2, 3],
                expected: 5,
                description: "addNumbers(2, 3) should return 5",
            },
            {
                input: [-1, 1],
                expected: 0,
                description: "addNumbers(-1, 1) should return 0",
            },
            {
                input: [0, 0],
                expected: 0,
                description: "addNumbers(0, 0) should return 0",
            },
        ],
    },
    {
        id: "2",
        slug: "find-maximum-in-array",
        title: "Find Maximum in Array",
        description: "Find the largest number in an array of numbers",
        difficulty: "easy",
        type: "array",
        estimatedTime: "10 minutes",
        isPremium: true,
        requiredPlan: "VIBED",
        moodAdapted: {
            rush: "Array hunting time! 🎯 Find that maximum like you're on a treasure hunt!",
            chill: "Gently scan through the array, one element at a time. No pressure. ☁️",
            grind: "Practice array iteration patterns. Consider both loop-based and built-in method approaches.",
        },
        starter: "function findMax(numbers) {\n  // Write your solution here\n  \n}",
        solution: "function findMax(numbers) {\n  return Math.max(...numbers);\n}",
        tests: [
            {
                input: [[1, 3, 2]],
                expected: 3,
                description: "findMax([1, 3, 2]) should return 3",
            },
            {
                input: [[-1, -5, -2]],
                expected: -1,
                description: "findMax([-1, -5, -2]) should return -1",
            },
            {
                input: [[42]],
                expected: 42,
                description: "findMax([42]) should return 42",
            },
        ],
    },
    {
        id: "3",
        slug: "palindrome-checker",
        title: "Palindrome Checker",
        description: "Check if a string reads the same forwards and backwards",
        difficulty: "medium",
        type: "logic",
        estimatedTime: "15 minutes",
        isPremium: true,
        requiredPlan: "CRACKED",
        moodAdapted: {
            rush: "Palindrome power! 🔄 Let's flip and reverse like a coding ninja!",
            chill: "A classic string puzzle. Take it step by step, character by character. 📖",
            grind: "Study string manipulation techniques. Consider case sensitivity and spaces.",
        },
        starter: "function isPalindrome(str) {\n  // Write your solution here\n  \n}",
        solution: "function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleaned === cleaned.split('').reverse().join('');\n}",
        tests: [
            {
                input: ["racecar"],
                expected: true,
                description: "isPalindrome('racecar') should return true",
            },
            {
                input: ["A man a plan a canal Panama"],
                expected: true,
                description: "Should handle spaces and caps",
            },
            {
                input: ["hello"],
                expected: false,
                description: "isPalindrome('hello') should return false",
            },
        ],
    },
];
