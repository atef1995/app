import { PrismaClient } from '@prisma/client';
import { generateUniqueUsername } from '../src/lib/username';

const prisma = new PrismaClient();

async function generateUsernamesForExistingUsers() {
  console.log('🔄 Generating usernames for existing users...');
  
  try {
    // Find all users without usernames
    const usersWithoutUsernames = await prisma.user.findMany({
      where: {
        username: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });

    console.log(`Found ${usersWithoutUsernames.length} users without usernames`);

    for (const user of usersWithoutUsernames) {
      try {
        const newUsername = await generateUniqueUsername(user.name, user.email);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { username: newUsername },
        });

        console.log(`✅ Generated username "${newUsername}" for ${user.name || user.email}`);
      } catch (error) {
        console.error(`❌ Failed to generate username for user ${user.id}:`, error);
      }
    }

    console.log('✨ Username generation completed!');
  } catch (error) {
    console.error('Error generating usernames:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateUsernamesForExistingUsers();
