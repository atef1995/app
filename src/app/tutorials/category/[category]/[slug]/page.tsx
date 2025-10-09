import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TutorialClient from "../../../../../components/tutorial/TutorialClient";
import ErrorBoundary, {
  TutorialErrorFallback,
} from "@/components/ErrorBoundary";

interface TutorialPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  // Check for session (but don't require it - allow anonymous browsing)
  const session = await getServerSession(authOptions);

  // Resolve params on server side
  const { category, slug } = await params;

  return (
    <ErrorBoundary fallback={TutorialErrorFallback}>
      <TutorialClient
        category={category}
        slug={slug}
        isAnonymous={!session}
      />
    </ErrorBoundary>
  );
}
