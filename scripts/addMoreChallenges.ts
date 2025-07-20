import { PrismaClient } from '@prisma/client';
import { slugify, generateUniqueSlug } from '../src/lib/slugify';

const prisma = new PrismaClient();

async function addMoreChallenges() {
  console.log('🚀 Adding more challenges to the database...');

  const challenges = [
    // String Manipulation Challenges
    {
      title: "Reverse String",
      description: "Write a function that reverses a string without using the built-in reverse method.",
      difficulty: "EASY" as const,
      type: "FUNCTION" as const,
      estimatedTime: 10,
      starter: `function reverseString(str) {
  // Your code here
  // Hint: You can use a loop or recursion
  return "";
}`,
      solution: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
      tests: [
        { input: ['"hello"'], expected: '"olleh"', description: "Reverse 'hello'" },
        { input: ['"JavaScript"'], expected: '"tpircSavaJ"', description: "Reverse 'JavaScript'" },
        { input: ['""'], expected: '""', description: "Empty string should return empty" },
        { input: ['"a"'], expected: '"a"', description: "Single character" }
      ],
      moodAdaptations: {
        CHILL: "Take your time with this classic string reversal challenge. Think about how you'd read a word backwards! 😌",
        RUSH: "Quick string flip! Loop backwards through the string and build the result. Go! ⚡",
        GRIND: "Master string manipulation fundamentals. Implement character-by-character reversal using iterative approach. 🔥"
      }
    },

    {
      title: "Count Vowels",
      description: "Count the number of vowels (a, e, i, o, u) in a given string.",
      difficulty: "EASY" as const,
      type: "FUNCTION" as const,
      estimatedTime: 8,
      starter: `function countVowels(str) {
  // Your code here
  // Vowels are: a, e, i, o, u (case insensitive)
  return 0;
}`,
      solution: `function countVowels(str) {
  const vowels = 'aeiouAEIOU';
  let count = 0;
  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}`,
      tests: [
        { input: ['"hello"'], expected: '2', description: "Count vowels in 'hello'" },
        { input: ['"JavaScript"'], expected: '3', description: "Count vowels in 'JavaScript'" },
        { input: ['"xyz"'], expected: '0', description: "No vowels" },
        { input: ['"AEIOU"'], expected: '5', description: "All uppercase vowels" }
      ],
      moodAdaptations: {
        CHILL: "Let's count some vowels! Just check each character and see if it's one of the five vowels. Easy peasy! 🌱",
        RUSH: "Vowel counter speedrun! Check each char against 'aeiou' - case insensitive! ⚡",
        GRIND: "Implement efficient vowel detection. Consider string traversal optimization and case handling strategies. 💪"
      }
    },

    // Array Challenges
    {
      title: "Find Maximum Number",
      description: "Find the largest number in an array without using Math.max().",
      difficulty: "EASY" as const,
      type: "ARRAY" as const,
      estimatedTime: 10,
      starter: `function findMax(numbers) {
  // Your code here
  // Don't use Math.max()
  return 0;
}`,
      solution: `function findMax(numbers) {
  if (numbers.length === 0) return null;
  
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}`,
      tests: [
        { input: ['[1, 3, 2, 8, 5]'], expected: '8', description: "Find max in positive numbers" },
        { input: ['[-1, -3, -2]'], expected: '-1', description: "Find max in negative numbers" },
        { input: ['[42]'], expected: '42', description: "Single element array" },
        { input: ['[5, 5, 5]'], expected: '5', description: "All elements equal" }
      ],
      moodAdaptations: {
        CHILL: "Find the biggest number in the bunch! Start with the first one and compare with the rest. 🏔️",
        RUSH: "Max finder sprint! Loop through, track the biggest so far. Classic algorithm! ⚡",
        GRIND: "Implement linear search for maximum element. Analyze time complexity and edge cases. 🎯"
      }
    },

    {
      title: "Remove Duplicates",
      description: "Remove duplicate elements from an array and return a new array with unique values.",
      difficulty: "MEDIUM" as const,
      type: "ARRAY" as const,
      estimatedTime: 15,
      starter: `function removeDuplicates(arr) {
  // Your code here
  // Return array with unique values only
  return [];
}`,
      solution: `function removeDuplicates(arr) {
  const unique = [];
  for (let item of arr) {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  }
  return unique;
}`,
      tests: [
        { input: ['[1, 2, 2, 3, 4, 4, 5]'], expected: '[1, 2, 3, 4, 5]', description: "Remove number duplicates" },
        { input: ['["a", "b", "a", "c"]'], expected: '["a", "b", "c"]', description: "Remove string duplicates" },
        { input: ['[]'], expected: '[]', description: "Empty array" },
        { input: ['[1, 1, 1]'], expected: '[1]', description: "All duplicates" }
      ],
      moodAdaptations: {
        CHILL: "Clean up that array! Keep track of what you've seen before and only add new items. 🧹",
        RUSH: "Duplicate destroyer! Check if item exists before adding. Build that unique array! ⚡",
        GRIND: "Implement deduplication algorithm. Consider Set vs array approaches and performance implications. 🔧"
      }
    },

    // Algorithm Challenges
    {
      title: "Fibonacci Sequence",
      description: "Generate the nth number in the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, ...).",
      difficulty: "MEDIUM" as const,
      type: "ALGORITHM" as const,
      estimatedTime: 20,
      starter: `function fibonacci(n) {
  // Your code here
  // F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)
  return 0;
}`,
      solution: `function fibonacci(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}`,
      tests: [
        { input: ['0'], expected: '0', description: "F(0) should be 0" },
        { input: ['1'], expected: '1', description: "F(1) should be 1" },
        { input: ['5'], expected: '5', description: "F(5) should be 5" },
        { input: ['10'], expected: '55', description: "F(10) should be 55" }
      ],
      moodAdaptations: {
        CHILL: "The beautiful Fibonacci sequence! Each number is the sum of the two before it. Build it step by step. 🌻",
        RUSH: "Fib sequence speedrun! Start with 0,1 then keep adding previous two numbers! ⚡",
        GRIND: "Master iterative Fibonacci implementation. Analyze space/time complexity vs recursive approach. 📊"
      }
    },

    {
      title: "Palindrome Checker",
      description: "Check if a string reads the same forwards and backwards (ignoring spaces and case).",
      difficulty: "MEDIUM" as const,
      type: "FUNCTION" as const,
      estimatedTime: 15,
      starter: `function isPalindrome(str) {
  // Your code here
  // Ignore spaces, punctuation, and case
  return false;
}`,
      solution: `function isPalindrome(str) {
  // Clean the string: remove non-alphanumeric and convert to lowercase
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Check if it reads the same forwards and backwards
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}`,
      tests: [
        { input: ['"racecar"'], expected: 'true', description: "Simple palindrome" },
        { input: ['"A man a plan a canal Panama"'], expected: 'true', description: "Palindrome with spaces" },
        { input: ['"race a car"'], expected: 'false', description: "Not a palindrome" },
        { input: ['"Madam"'], expected: 'true', description: "Case insensitive palindrome" }
      ],
      moodAdaptations: {
        CHILL: "Does it read the same backwards? Clean up the string first, then check both directions! 🪞",
        RUSH: "Palindrome detector! Strip spaces/punctuation, compare with reverse! ⚡",
        GRIND: "Implement robust palindrome validation with preprocessing and efficient comparison logic. 🔍"
      }
    },

    // Object Manipulation
    {
      title: "Object Property Counter",
      description: "Count the number of properties in an object (not including nested objects).",
      difficulty: "EASY" as const,
      type: "OBJECT" as const,
      estimatedTime: 8,
      starter: `function countProperties(obj) {
  // Your code here
  // Count direct properties only
  return 0;
}`,
      solution: `function countProperties(obj) {
  return Object.keys(obj).length;
}`,
      tests: [
        { input: ['{ name: "John", age: 30 }'], expected: '2', description: "Simple object with 2 properties" },
        { input: ['{}'], expected: '0', description: "Empty object" },
        { input: ['{ a: 1, b: 2, c: 3, d: 4 }'], expected: '4', description: "Object with 4 properties" },
        { input: ['{ x: { y: 1 } }'], expected: '1', description: "Object with nested object (count as 1)" }
      ],
      moodAdaptations: {
        CHILL: "Just count those object properties! Think about what JavaScript gives you to work with objects. 🔢",
        RUSH: "Property counter! Use Object.keys() for instant property list! ⚡",
        GRIND: "Analyze object property enumeration. Consider Object.keys() vs for...in vs Object.getOwnPropertyNames(). 📋"
      }
    },

    // Logic Challenges
    {
      title: "FizzBuzz",
      description: "Return 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for multiples of both, or the number itself.",
      difficulty: "EASY" as const,
      type: "LOGIC" as const,
      estimatedTime: 12,
      starter: `function fizzBuzz(n) {
  // Your code here
  // Multiples of 3: "Fizz"
  // Multiples of 5: "Buzz"  
  // Multiples of both: "FizzBuzz"
  // Otherwise: the number
  return "";
}`,
      solution: `function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}`,
      tests: [
        { input: ['3'], expected: '"Fizz"', description: "Multiple of 3" },
        { input: ['5'], expected: '"Buzz"', description: "Multiple of 5" },
        { input: ['15'], expected: '"FizzBuzz"', description: "Multiple of both 3 and 5" },
        { input: ['7'], expected: '"7"', description: "Regular number" }
      ],
      moodAdaptations: {
        CHILL: "The classic FizzBuzz! Check divisibility and return the right word. A programming interview favorite! 🎯",
        RUSH: "FizzBuzz speedrun! Check 15 first, then 3, then 5. Modulo operator is your friend! ⚡",
        GRIND: "Master conditional logic and modular arithmetic. Optimize for readability and performance. 🧮"
      }
    },

    // Advanced Challenges
    {
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a target sum. Return their indices.",
      difficulty: "MEDIUM" as const,
      type: "ALGORITHM" as const,
      estimatedTime: 25,
      starter: `function twoSum(nums, target) {
  // Your code here
  // Return array of two indices [i, j] where nums[i] + nums[j] = target
  return [];
}`,
      solution: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
      tests: [
        { input: ['[2, 7, 11, 15]', '9'], expected: '[0, 1]', description: "2 + 7 = 9" },
        { input: ['[3, 2, 4]', '6'], expected: '[1, 2]', description: "2 + 4 = 6" },
        { input: ['[3, 3]', '6'], expected: '[0, 1]', description: "3 + 3 = 6" },
        { input: ['[1, 2, 3]', '7'], expected: '[]', description: "No solution exists" }
      ],
      moodAdaptations: {
        CHILL: "Find the perfect pair! Look for two numbers that add up to your target. Think about what you've seen before. 🎯",
        RUSH: "Two Sum attack! Use a Map to track complements as you go. One pass solution! ⚡",
        GRIND: "Implement optimal two-pointer or hash map approach. Analyze O(n) vs O(n²) solutions. 🚀"
      }
    },

    {
      title: "Valid Parentheses",
      description: "Check if a string of parentheses, brackets, and braces is valid (properly opened and closed).",
      difficulty: "HARD" as const,
      type: "ALGORITHM" as const,
      estimatedTime: 30,
      starter: `function isValidParentheses(s) {
  // Your code here
  // Valid: () [] {} ([{}]) 
  // Invalid: ([)] {[} ((
  return false;
}`,
      solution: `function isValidParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char === ')' || char === '}' || char === ']') {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
      tests: [
        { input: ['"()"'], expected: 'true', description: "Simple valid parentheses" },
        { input: ['"()[]{}"'], expected: 'true', description: "Multiple valid brackets" },
        { input: ['"([)]"'], expected: 'false', description: "Invalid interleaved brackets" },
        { input: ['"((("'], expected: 'false', description: "Unclosed parentheses" }
      ],
      moodAdaptations: {
        CHILL: "Balance those brackets! Use a stack to keep track of opening brackets and match them with closing ones. 🥞",
        RUSH: "Bracket validator! Stack for opens, pop and match for closes. Classic stack problem! ⚡",
        GRIND: "Master stack-based bracket matching. Implement with optimal space/time complexity and error handling. 🏗️"
      }
    },

    {
      title: "Array Intersection",
      description: "Find the common elements between two arrays.",
      difficulty: "MEDIUM" as const,
      type: "ARRAY" as const,
      estimatedTime: 18,
      starter: `function arrayIntersection(arr1, arr2) {
  // Your code here
  // Return array of elements that exist in both arrays
  return [];
}`,
      solution: `function arrayIntersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const result = [];
  
  for (let item of arr2) {
    if (set1.has(item) && !result.includes(item)) {
      result.push(item);
    }
  }
  
  return result;
}`,
      tests: [
        { input: ['[1, 2, 3]', '[2, 3, 4]'], expected: '[2, 3]', description: "Common numbers" },
        { input: ['["a", "b", "c"]', '["b", "c", "d"]'], expected: '["b", "c"]', description: "Common strings" },
        { input: ['[1, 2]', '[3, 4]'], expected: '[]', description: "No common elements" },
        { input: ['[]', '[1, 2]'], expected: '[]', description: "Empty array" }
      ],
      moodAdaptations: {
        CHILL: "Find what's common between the arrays! Check each element of one array against the other. 🤝",
        RUSH: "Array intersection finder! Use Set for O(1) lookups. Find those common elements! ⚡",
        GRIND: "Optimize intersection algorithm using Set data structure. Consider duplicate handling strategies. 🔄"
      }
    }
  ];

  // Insert challenges
  const existingSlugs: string[] = [];
  
  // Get existing slugs from database to avoid conflicts
  const existingChallenges = await prisma.challenge.findMany({ select: { slug: true } });
  existingSlugs.push(...existingChallenges.map(c => c.slug));

  for (const challenge of challenges) {
    try {
      console.log(`Adding challenge: ${challenge.title}`);
      
      // Generate unique slug for this challenge
      const baseSlug = slugify(challenge.title);
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
      existingSlugs.push(uniqueSlug);
      
      const createdChallenge = await prisma.challenge.create({
        data: {
          slug: uniqueSlug,
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
          type: challenge.type,
          estimatedTime: `${challenge.estimatedTime} minutes`,
          starter: challenge.starter,
          solution: challenge.solution,
        },
      });

      // Add tests
      for (const test of challenge.tests) {
        await prisma.challengeTest.create({
          data: {
            challengeId: createdChallenge.id,
            input: JSON.stringify(test.input),
            expected: JSON.stringify(test.expected),
            description: test.description,
          },
        });
      }

      // Add mood adaptations
      for (const [mood, content] of Object.entries(challenge.moodAdaptations)) {
        await prisma.challengeMoodAdaptation.create({
          data: {
            challengeId: createdChallenge.id,
            mood: mood as "CHILL" | "RUSH" | "GRIND",
            content: content,
          },
        });
      }

      console.log(`✅ Added challenge: ${challenge.title}`);
    } catch (error) {
      console.error(`❌ Error adding challenge ${challenge.title}:`, error);
    }
  }

  console.log('🎉 Finished adding challenges!');
}

addMoreChallenges()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
