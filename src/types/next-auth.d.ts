import "next-auth";
import { Mood, Plan } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mood?: Mood;
      subscription?: Plan;
      username: string;
      role: string;
    };
  }

  interface User {
    id: string;
    mood?: Mood;
    subscription?: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
  }
}
