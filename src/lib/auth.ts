import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          select: { mood: true, subscription: true },
        });
        session.user.mood = dbUser?.mood || "CHILL";
        session.user.subscription = dbUser?.subscription || "FREE";
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
      return true;
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
