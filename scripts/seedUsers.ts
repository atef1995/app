import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleUsers = [
  {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    mood: "GRIND"
  },
  {
    name: "Sarah Martinez",
    email: "sarah.martinez@example.com", 
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=150&h=150&fit=crop&crop=face",
    mood: "CHILL"
  },
  {
    name: "Jordan Thompson",
    email: "jordan.thompson@example.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    mood: "RUSH"
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    mood: "CHILL"
  },
  {
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    mood: "GRIND"
  },
  {
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    mood: "RUSH"
  },
  {
    name: "David Park",
    email: "david.park@example.com",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    mood: "CHILL"
  },
  {
    name: "Maya Patel",
    email: "maya.patel@example.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    mood: "GRIND"
  },
  {
    name: "Jake Wilson",
    email: "jake.wilson@example.com",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    mood: "RUSH"
  },
  {
    name: "Zoe Kim",
    email: "zoe.kim@example.com",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    mood: "CHILL"
  },
  {
    name: "Ryan O'Connor",
    email: "ryan.oconnor@example.com",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    mood: "GRIND"
  },
  {
    name: "Nina Ivanova",
    email: "nina.ivanova@example.com",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    mood: "RUSH"
  },
  {
    name: "Carlos Silva",
    email: "carlos.silva@example.com",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face",
    mood: "CHILL"
  },
  {
    name: "Aisha Hassan",
    email: "aisha.hassan@example.com",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    mood: "GRIND"
  },
  {
    name: "Tyler Brooks",
    email: "tyler.brooks@example.com",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
    mood: "RUSH"
  }
];

const progressActivities = [
  "Completed JavaScript Fundamentals tutorial",
  "Mastered Array Methods challenge",
  "Solved 5 coding challenges in a row",
  "Achieved 95% score on Functions quiz",
  "Completed first React component",
  "Learned about async/await",
  "Built a mini calculator app",
  "Understood closure concepts",
  "Mastered DOM manipulation",
  "Completed ES6 features tutorial"
];

async function seedUsers() {
  console.log('🌱 Seeding users...');

  try {
    // Create users
    for (const userData of sampleUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            ...userData,
            emailVerified: new Date(),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          }
        });
        console.log(`✅ Created user: ${userData.name}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.name}`);
      }
    }

    // Create some sample progress shares
    const users = await prisma.user.findMany({
      take: 10
    });

    for (const user of users) {
      // Create 2-4 random progress activities for each user
      const activityCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < activityCount; i++) {
        const randomActivity = progressActivities[Math.floor(Math.random() * progressActivities.length)];
        const randomPoints = Math.floor(Math.random() * 100) + 50;
        const randomScore = Math.floor(Math.random() * 30) + 70;
        
        await prisma.progressShare.create({
          data: {
            userId: user.id,
            type: Math.random() > 0.5 ? 'TUTORIAL_COMPLETED' : 'CHALLENGE_SOLVED',
            title: randomActivity,
            description: `${user.name} just ${randomActivity.toLowerCase()} 🎉`,
            data: {
              points: randomPoints,
              score: randomScore,
              mood: user.mood
            },
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
          }
        });
      }
    }

    console.log('🎉 Successfully seeded users and progress activities!');
    console.log(`📊 Created ${sampleUsers.length} users with sample progress data`);
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedUsers()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
