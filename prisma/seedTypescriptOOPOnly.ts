#!/usr/bin/env tsx

/**
 * Standalone seeding script for TypeScript OOP tutorials, quizzes, and achievements
 * Run with: npm run seed:typescript-oop or tsx prisma/seedTypescriptOOPOnly.ts
 */

import { seedTypescriptOOP } from "./seeds/typescriptOOPSeeds";

// Run the TypeScript OOP seeding
seedTypescriptOOP().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { seedTypescriptOOP };