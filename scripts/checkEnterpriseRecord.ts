import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkEnterpriseRecord() {
  try {
    const enterprise = await prisma.tutorial.findMany({
      where: {
        title: {
          contains: "Enterprise",
        },
      },
      select: {
        id: true,
        title: true,
        requiredPlan: true,
      },
    });

    console.log("Enterprise tutorial record:", enterprise);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnterpriseRecord();
