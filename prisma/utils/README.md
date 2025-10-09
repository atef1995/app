# Tutorial Seeding Utilities

This directory contains reusable utility functions for seeding tutorials and quizzes in the database.

## Overview

The `seedTutorialHelpers.ts` module provides a set of functions that eliminate code duplication across tutorial seed files and ensure consistency in how tutorials and quizzes are created.

## Core Functions

### `seedTutorial(categorySlug, tutorialData, prisma)`

Seeds a single tutorial into the database.

**Parameters:**
- `categorySlug` (string): The slug of the category to associate the tutorial with
- `tutorialData` (TutorialSeedData): Tutorial data object
- `prisma` (PrismaClient): Prisma client instance

**Returns:** The created or updated Tutorial object

**Throws:** Error if category is not found

**Example:**
```typescript
const tutorial = await seedTutorial('data-structures', {
  slug: '02-two-pointer-technique',
  title: 'Master the Two-Pointer Technique',
  description: 'Learn the two-pointer technique...',
  mdxFile: 'data-structures/02-two-pointer-technique',
  difficulty: 3,
  order: 2,
  published: true,
  isPremium: false,
  requiredPlan: 'FREE',
  estimatedTime: 30.0
}, prisma);
```

---

### `seedTutorials(categorySlug, tutorials, prisma)`

Seeds multiple tutorials for a category.

**Parameters:**
- `categorySlug` (string): The slug of the category
- `tutorials` (TutorialSeedData[]): Array of tutorial data objects
- `prisma` (PrismaClient): Prisma client instance

**Returns:** Array of created or updated Tutorial objects

**Example:**
```typescript
const tutorials = await seedTutorials('data-structures', [
  { slug: '01-arrays', ... },
  { slug: '02-two-pointer', ... }
], prisma);
```

---

### `seedQuiz(quizData, prisma)`

Seeds a single quiz into the database.

**Parameters:**
- `quizData` (QuizSeedData): Quiz data object including tutorialSlug
- `prisma` (PrismaClient): Prisma client instance

**Returns:** The created or updated Quiz object, or null if tutorial not found

**Example:**
```typescript
const quiz = await seedQuiz({
  slug: '02-two-pointer-quiz',
  title: 'Two Pointer Quiz',
  tutorialSlug: '02-two-pointer-technique',
  isPremium: false,
  requiredPlan: 'FREE',
  questions: [...]
}, prisma);
```

---

### `seedQuizzes(quizzes, prisma)`

Seeds multiple quizzes.

**Parameters:**
- `quizzes` (QuizSeedData[]): Array of quiz data objects
- `prisma` (PrismaClient): Prisma client instance

**Returns:** Array of created or updated Quiz objects (with null for skipped quizzes)

**Example:**
```typescript
const quizzes = await seedQuizzes([
  { slug: '01-arrays-quiz', tutorialSlug: '01-arrays', ... },
  { slug: '02-two-pointer-quiz', tutorialSlug: '02-two-pointer', ... }
], prisma);
```

---

### `seedTutorialWithQuiz(categorySlug, tutorialData, quizData, prisma)`

Seeds a tutorial and its quiz together in the correct order.

**Parameters:**
- `categorySlug` (string): The category slug
- `tutorialData` (TutorialSeedData): Tutorial data object
- `quizData` (QuizSeedData | null): Quiz data object (optional)
- `prisma` (PrismaClient): Prisma client instance

**Returns:** Object with `{ tutorial, quiz }` properties

**Example:**
```typescript
const { tutorial, quiz } = await seedTutorialWithQuiz(
  'data-structures',
  tutorialData,
  quizData,
  prisma
);
```

## TypeScript Interfaces

### TutorialSeedData

```typescript
interface TutorialSeedData {
  slug: string;           // Unique identifier (e.g., "02-two-pointer-technique")
  title: string;          // Display title
  description: string;    // Brief description for SEO and cards
  mdxFile: string;        // Path to MDX file relative to content/tutorials/
  difficulty: number;     // 1-5 difficulty rating
  order: number;          // Display order within category
  published: boolean;     // Whether tutorial is live
  isPremium: boolean;     // Requires premium subscription
  requiredPlan: string;   // "FREE" | "PRO" | "PREMIUM"
  estimatedTime: number;  // Minutes to complete
}
```

### QuizSeedData

```typescript
interface QuizSeedData {
  slug: string;           // Unique identifier (e.g., "02-two-pointer-quiz")
  title: string;          // Quiz title
  tutorialSlug: string;   // Associated tutorial slug
  isPremium: boolean;     // Requires premium subscription
  requiredPlan: string;   // "FREE" | "PRO" | "PREMIUM"
  questions: QuizQuestion[]; // Array of quiz questions
}
```

### QuizQuestion

```typescript
interface QuizQuestion {
  id: string;          // Unique question ID (e.g., "two-pointer-1")
  question: string;    // The question text
  type: string;        // Question type (e.g., "multiple-choice")
  options: string[];   // Array of answer options
  correct: number;     // Index of correct answer (0-based)
  explanation: string; // Explanation shown after answering
}
```

## Usage in Seed Files

### Basic Pattern

```typescript
import { PrismaClient } from "@prisma/client";
import { seedTutorials, seedQuizzes } from "./utils/seedTutorialHelpers";

const prisma = new PrismaClient();

const myTutorials = [
  { slug: 'tutorial-1', ... },
  { slug: 'tutorial-2', ... }
];

const myQuizzes = [
  { slug: 'tutorial-1-quiz', tutorialSlug: 'tutorial-1', ... },
  { slug: 'tutorial-2-quiz', tutorialSlug: 'tutorial-2', ... }
];

export async function seedMyTutorials() {
  console.log("🌱 Seeding my tutorials...");

  await seedTutorials('category-slug', myTutorials, prisma);
  await seedQuizzes(myQuizzes, prisma);

  console.log("✅ Done!");
}
```

### Running Seed Files

Add npm scripts to `package.json`:

```json
{
  "scripts": {
    "db:seed:dsa": "npx tsx prisma/seedDsaTutorials.ts"
  }
}
```

Then run:
```bash
npm run db:seed:dsa
```

## Benefits

1. **DRY (Don't Repeat Yourself)**: Write tutorial data once, seeding logic is handled by utilities
2. **Type Safety**: TypeScript interfaces prevent common mistakes
3. **Consistency**: All tutorials are seeded the same way
4. **Error Handling**: Centralized error messages and validation
5. **Maintainability**: Update seeding logic in one place
6. **Logging**: Consistent, helpful console output
7. **Idempotent**: Uses `upsert` so running seeds multiple times is safe

## Error Handling

- **Missing Category**: Throws error with helpful message to run `seedCategories` first
- **Missing Tutorial** (for quiz): Warns and skips quiz creation, returns null
- **Database Errors**: Propagates errors with full stack trace for debugging

## Best Practices

1. **Category First**: Always run category seeding before tutorial seeding
2. **Tutorial Before Quiz**: seedQuiz validates tutorial exists
3. **Use Batch Functions**: Prefer `seedTutorials`/`seedQuizzes` over loops
4. **Consistent Naming**: Use pattern `{tutorial-slug}-quiz` for quiz slugs
5. **MDX Paths**: Use category prefix in mdxFile paths (e.g., `data-structures/tutorial-name`)
6. **Order Numbers**: Use multiples of 10 (10, 20, 30) to allow insertions

## Example: Complete Seed File

See `prisma/seedDsaTutorials.ts` for a complete working example.
