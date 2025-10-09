import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearMigrations() {
  try {
    await prisma.$executeRawUnsafe('DELETE FROM "_prisma_migrations"');
    console.log('✅ Cleared migration history');
  } catch (error) {
    console.error('❌ Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMigrations();
