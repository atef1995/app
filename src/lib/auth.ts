import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { generateUniqueUsername } from "@/lib/username";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      console.log("Session callback - session:", session, "user:", user);
      if (session?.user && user) {
        session.user.id = user.id;
        // Add mood to session
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { mood: true, subscription: true, username: true },
        });
        session.user.mood = dbUser?.mood || "CHILL";
        session.user.subscription = dbUser?.subscription || "FREE";

        // Ensure user has a username, generate if missing
        if (!dbUser?.username) {
          const newUsername = await generateUniqueUsername(
            user.name,
            user.email
          );
          await prisma.user.update({
            where: { id: user.id },
            data: { username: newUsername },
          });
          console.log(
            `Generated username "${newUsername}" for user ${user.email} during session`
          );
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      console.log("SignIn callback - user:", user, "account:", account);

      // For new users, we'll generate username after they're created
      // The session callback will handle it for both new and existing users
      return true;
    },
  },
  events: {
    createUser: async ({ user }) => {
      console.log("CreateUser event - user:", user);

      // Generate username for newly created users
      if (user.email && user.name) {
        try {
          const newUsername = await generateUniqueUsername(
            user.name,
            user.email
          );
          await prisma.user.update({
            where: { id: user.id },
            data: { username: newUsername },
          });
          console.log(
            `Generated username "${newUsername}" for new user ${user.email}`
          );
        } catch (error) {
          console.error("Failed to generate username for new user:", error);
        }
      }
    },
  },
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};
