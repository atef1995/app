import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { generateUniqueUsername } from "@/lib/username";
import { emailService } from "@/lib/services/emailService";
import type { NextAuthOptions } from "next-auth";
import { devMode } from "./services/envService";
import { SubscriptionService, type SubscriptionInfo } from "@/lib/subscriptionService";

const debugMode = devMode();

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
      authorization: {
        params: {
          // Request repo scope to access PR information for contribution system
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (debugMode) {
        console.log("Session callback - session:", session, "user:", user);
      }
      try {
        if (session?.user && user) {
          session.user.id = user.id;

          // Fetch full subscription info once and cache in session
          // This eliminates the need for repeated subscription API calls
          const subscriptionInfo = await SubscriptionService.getUserSubscription(user.id);

          // Add mood, subscription, role, xp, and level to session
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              mood: true,
              subscription: true,
              username: true,
              role: true,
              xp: true,
              level: true,
            },
          });

          session.user.mood = dbUser?.mood || "CHILL";
          session.user.subscription = dbUser?.subscription || "FREE";
          session.user.role = dbUser?.role || "USER";
          session.user.xp = dbUser?.xp || 0;
          session.user.level = dbUser?.level || 1;

          // Store full subscription info in session to prevent repeated DB queries
          session.user.subscriptionInfo = subscriptionInfo;

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
            if (debugMode) {
              console.log(
                `Generated username "${newUsername}" for user ${user.email} during session`
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
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
      if (debugMode) {
        console.log("SignIn callback - user:", user, "account:", account);
      }

      // Capture GitHub access token and username for contribution system
      if (account?.provider === "github" && account.access_token && user.id) {
        try {
          // Use Octokit to get the GitHub username
          const { Octokit } = await import("@octokit/rest");
          const octokit = new Octokit({ auth: account.access_token });
          const { data: ghUser } = await octokit.rest.users.getAuthenticated();

          await prisma.user.update({
            where: { id: user.id },
            data: {
              githubUsername: ghUser.login,
              githubAccessToken: account.access_token,
              githubProfileUrl: ghUser.html_url,
            },
          });

          if (debugMode) {
            console.log(
              `Stored GitHub credentials for user ${user.id} (${ghUser.login})`
            );
          }
        } catch (error) {
          console.error("Failed to store GitHub credentials:", error);
        }
      }

      return true;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (debugMode) {
        console.log("CreateUser event - user:", user);
      }
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
          if (debugMode) {
            console.log(
              `Generated username "${newUsername}" for new user ${user.email}`
            );
          }
          // Get the updated user data for welcome email
          const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          if (fullUser) {
            // Send welcome email asynchronously
            emailService.sendWelcomeEmail(fullUser).catch((error) => {
              console.error("Failed to send welcome email:", error);
            });
          }
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
