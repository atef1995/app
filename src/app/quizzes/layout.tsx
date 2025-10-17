import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";
    const response = await fetch(`${baseUrl}/api/quizzes`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    const data = await response.json();
    const quizCount = data.quizzes?.length || 0;

    return {
      title: `Coding Quizzes - ${quizCount}+ Interactive Quizzes | Vibed to Cracked`,
      description: `Master your coding skills with ${quizCount}+ interactive quizzes covering JavaScript, HTML, CSS, GitHub, OOP, DSA and more. Free to attempt, sign up to save your progress.`,
      keywords:
        "coding quizzes, javascript quizzes, html css quizzes, dsa quizzes, oop quizzes, github quizzes, programming practice, web development",
      openGraph: {
        title: "Coding Quizzes - Master Multiple Programming Languages",
        description: `${quizCount}+ interactive quizzes for JavaScript, HTML, CSS, DSA, OOP, GitHub and more. Learn at your own pace.`,
        type: "website",
        url: "/quizzes",
      },
    };
  } catch (error) {
    console.error("Error generating quizzes metadata:", error);

    // Fallback metadata
    return {
      title:
        "Coding Quizzes - JavaScript, HTML, CSS, DSA, OOP & More | Vibed to Cracked",
      description:
        "Test your coding knowledge with interactive quizzes covering JavaScript, HTML, CSS, GitHub, OOP, DSA and more. Practice all levels from fundamentals to advanced. Sign up free to track your progress.",
      keywords:
        "coding quizzes, javascript quizzes, html css quizzes, dsa quizzes, oop quizzes, github quizzes, programming practice, web development",
      openGraph: {
        title: "Coding Quizzes - Master Multiple Programming Languages",
        description:
          "Interactive quizzes for JavaScript, HTML, CSS, DSA, OOP, GitHub and more. Learn at your own pace with personalized difficulty levels.",
        type: "website",
        url: "/quizzes",
      },
    };
  }
}

export default function QuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
