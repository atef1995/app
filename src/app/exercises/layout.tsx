import type { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${baseUrl}/api/exercises`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) throw new Error("Failed to fetch exercises");

    const data = await response.json();
    const exerciseCount = data.data?.length || 0;

    return {
      title: `Interactive Coding Exercises - ${exerciseCount}+ Hands-On Practice Problems | Vibed to Cracked`,
      description: `Master coding with ${exerciseCount}+ interactive exercises. HTML, CSS, JavaScript, and full-stack problems. Build real skills with hands-on practice.`,
      keywords:
        "coding exercises, programming practice, javascript exercises, html css practice, interactive coding, web development exercises",
      openGraph: {
        title: "Interactive Coding Exercises - Learn by Doing",
        description: `Practice with ${exerciseCount}+ interactive coding exercises. From beginner to advanced.`,
        type: "website",
        url: "/exercises",
        siteName: "Vibed to Cracked",
      },
      twitter: {
        card: "summary_large_image",
        title: `Interactive Coding Exercises - ${exerciseCount}+ Problems`,
        description:
          "Practice coding with interactive exercises. Build real skills.",
      },
    };
  } catch (error) {
    console.error("Error generating exercises metadata:", error);

    // Fallback metadata
    return {
      title: "Interactive Coding Exercises - Vibed to Cracked",
      description:
        "Master coding with interactive hands-on exercises. HTML, CSS, JavaScript, and full-stack problems. Build real skills through practice.",
      keywords:
        "coding exercises, programming practice, javascript exercises, html css practice, interactive coding",
      openGraph: {
        title: "Interactive Coding Exercises",
        description: "Practice coding with hands-on interactive exercises.",
        type: "website",
      },
    };
  }
}

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
