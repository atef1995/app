import { prisma } from "@/lib/prisma";
import { Phase } from "@prisma/client";

export const createPhase = async (phase: Phase) => {
  // Create phases
  await prisma.phase.upsert({
    where: { slug: phase.slug },
    update: phase,
    create: phase,
  });
  console.log(`✅ Phase: ${phase.title}`);
};
