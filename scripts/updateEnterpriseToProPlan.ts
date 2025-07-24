import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateEnterpriseToCracked() {
  try {
    // First, let's see what records have ENTERPRISE
    console.log("Checking for records with ENTERPRISE plan...");

    // Check tutorials
    const tutorials = await prisma.$queryRaw`
      SELECT id, title, requiredPlan 
      FROM tutorials 
      WHERE requiredPlan = 'ENTERPRISE'
    `;
    console.log("Tutorials with ENTERPRISE plan:", tutorials);

    // Check users
    const users = await prisma.$queryRaw`
      SELECT id, email, subscription 
      FROM users 
      WHERE subscription = 'ENTERPRISE'
    `;
    console.log("Users with ENTERPRISE subscription:", users);

    // Update tutorials
    const tutorialUpdate = await prisma.$executeRaw`
      UPDATE tutorials 
      SET requiredPlan = 'CRACKED' 
      WHERE requiredPlan = 'ENTERPRISE'
    `;
    console.log(
      `Updated ${tutorialUpdate} tutorials from ENTERPRISE to CRACKED`
    );

    // Update users
    const userUpdate = await prisma.$executeRaw`
      UPDATE users 
      SET subscription = 'CRACKED' 
      WHERE subscription = 'ENTERPRISE'
    `;
    console.log(`Updated ${userUpdate} users from ENTERPRISE to CRACKED`);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEnterpriseToCracked();
