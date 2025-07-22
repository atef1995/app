import { prisma } from './prisma';

/**
 * Generates a unique username from user's name or email
 */
export async function generateUniqueUsername(name?: string | null, email?: string | null): Promise<string> {
  // Start with name or email prefix
  let baseUsername = '';
  
  if (name) {
    // Use name, remove spaces and special characters
    baseUsername = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);
  } else if (email) {
    // Use email prefix before @
    baseUsername = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);
  }
  
  // Fallback if no valid base
  if (!baseUsername) {
    baseUsername = 'user';
  }
  
  // Check if username exists
  const existingUser = await prisma.user.findUnique({
    where: { username: baseUsername },
    select: { id: true }
  });
  
  if (!existingUser) {
    return baseUsername;
  }
  
  // If exists, try with numbers
  let counter = 1;
  let candidateUsername = `${baseUsername}${counter}`;
  
  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username: candidateUsername },
      select: { id: true }
    });
    
    if (!existing) {
      return candidateUsername;
    }
    
    counter++;
    candidateUsername = `${baseUsername}${counter}`;
    
    // Safety break to avoid infinite loop
    if (counter > 9999) {
      // Generate random suffix
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${baseUsername}_${randomSuffix}`;
    }
  }
}

/**
 * Ensures a user has a username, generates one if missing
 */
export async function ensureUserHasUsername(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, name: true, email: true }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.username) {
    return user.username;
  }
  
  // Generate and save username
  const newUsername = await generateUniqueUsername(user.name, user.email);
  
  await prisma.user.update({
    where: { id: userId },
    data: { username: newUsername }
  });
  
  return newUsername;
}
