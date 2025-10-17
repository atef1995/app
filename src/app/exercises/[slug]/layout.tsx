import type { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(`${baseUrl}/api/exercises/slug/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Exercise not found");
    }

    const data = await response.json();
    const exercise = data.exercise;

    if (!exercise) {
      return {
        title: "Exercise Not Found - Vibed to Cracked",
        description: "The requested exercise could not be found.",
      };
    }

    const difficultyLabel =
      exercise.difficulty.charAt(0).toUpperCase() +
      exercise.difficulty.slice(1);

    return {
      title: `${exercise.title} - ${difficultyLabel} Coding Exercise | Vibed to Cracked`,
      description: `${
        exercise.description
      } Solve this ${difficultyLabel.toLowerCase()} hands-on coding exercise in about ${
        exercise.estimatedTime
      } minutes.`,
      keywords: `${exercise.title.toLowerCase()} exercise, coding challenge, ${
        exercise.category
      }, web development`,
      openGraph: {
        title: `${exercise.title} - Coding Exercise`,
        description: `${exercise.description} Learn by solving this interactive exercise.`,
        type: "website",
        url: `/exercises/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${exercise.title} - Coding Exercise`,
        description: `${difficultyLabel} exercise - ~${exercise.estimatedTime} min to complete`,
      },
    };
  } catch (error) {
    console.error("Error generating exercise metadata:", error);

    // Fallback metadata
    return {
      title: "Interactive Coding Exercise - Vibed to Cracked",
      description:
        "Solve hands-on coding exercises to build real programming skills. Learn HTML, CSS, JavaScript, and more.",
      keywords: "coding exercise, programming challenge, interactive coding",
      openGraph: {
        title: "Interactive Coding Exercise",
        description: "Practice coding with hands-on exercises.",
        type: "website",
      },
    };
  }
}

export default function ExerciseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
