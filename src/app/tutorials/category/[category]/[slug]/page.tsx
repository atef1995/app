import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TutorialClient from "./TutorialClient";

interface TutorialPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  // Server-side session check - no re-renders!
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/signin");
  }

  // Resolve params on server side
  const { category, slug } = await params;

  return <TutorialClient category={category} slug={slug} />;
}