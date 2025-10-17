import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch quiz data to generate dynamic metadata
    const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";
    const response = await fetch(`${baseUrl}/api/quizzes/slug/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Quiz not found");
    }

    const data = await response.json();
    const quiz = data.quiz;

    if (!quiz) {
      return {
        title: "Quiz Not Found - Vibed to Cracked",
        description: "The requested quiz could not be found.",
      };
    }

    // Extract category from tutorial or use generic "coding"
    const category = quiz.tutorialId
      ? quiz.tutorialId.split("-")[0] || "coding"
      : "coding";

    return {
      title: `${quiz.title} Quiz - Test Your ${category} Skills | Vibed to Cracked`,
      description: `Master ${quiz.title.toLowerCase()} with interactive quizzes. Free to attempt, sign up to save your score and track progress.`,
      keywords: `${quiz.title.toLowerCase()} quiz, ${quiz.title.toLowerCase()} test, coding practice, programming test`,
      openGraph: {
        title: `${quiz.title} Quiz - Challenge Yourself`,
        description: `Test your ${quiz.title.toLowerCase()} knowledge with interactive questions. Multiple difficulty levels available.`,
        type: "website",
        url: `/quiz/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating quiz metadata:", error);

    // Fallback metadata
    return {
      title: "Interactive Coding Quiz - Vibed to Cracked",
      description:
        "Test your coding knowledge with interactive quizzes. Available for JavaScript, HTML, CSS, DSA, OOP, GitHub and more. Free to attempt, sign up to save your score.",
      keywords:
        "coding quiz, programming test, javascript test, html css quiz, dsa quiz, oop quiz",
      openGraph: {
        title: "Interactive Coding Quiz",
        description: "Challenge yourself with our interactive coding quizzes.",
        type: "website",
      },
    };
  }
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
