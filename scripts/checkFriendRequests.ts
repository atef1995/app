import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFriendRequests() {
  console.log('🔍 Checking friend requests in the database...');
  
  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log(`Found ${friendRequests.length} pending friend requests:`);
    
    friendRequests.forEach((request, index) => {
      console.log(`\n${index + 1}. Request ID: ${request.id}`);
      console.log(`   From: ${request.sender?.name} (@${request.sender?.username}) - ${request.sender?.email}`);
      console.log(`   To: ${request.receiver?.name} (@${request.receiver?.username}) - ${request.receiver?.email}`);
      console.log(`   Message: "${request.message}"`);
      console.log(`   Created: ${request.createdAt}`);
    });
    
  } catch (error) {
    console.error('Error checking friend requests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFriendRequests();
