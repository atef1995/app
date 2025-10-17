import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";
    const response = await fetch(`${baseUrl}/api/tutorials`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tutorials");
    }

    const data = await response.json();
    const tutorialCount = data.data?.length || 0;

    return {
      title: `Learn Coding - ${tutorialCount}+ Free Tutorials | JavaScript, HTML, CSS, OOP, DSA | Vibed to Cracked`,
      description: `Master programming with ${tutorialCount}+ comprehensive tutorials covering JavaScript, HTML, CSS, GitHub, OOP, DSA and more. Learn at your own pace with mood-driven content.`,
      keywords:
        "coding tutorials, javascript tutorial, html css tutorial, learn programming, dsa tutorial, oop tutorial, github tutorial, web development",
      openGraph: {
        title: "Learn Coding - Comprehensive Tutorials for All Levels",
        description: `${tutorialCount}+ interactive tutorials to help you master JavaScript, HTML, CSS, DSA, OOP and more.`,
        type: "website",
        url: "/tutorials",
      },
    };
  } catch (error) {
    console.error("Error generating tutorials metadata:", error);

    // Fallback metadata
    return {
      title: "Learn Coding - Free Programming Tutorials | Vibed to Cracked",
      description:
        "Master programming with comprehensive tutorials covering JavaScript, HTML, CSS, GitHub, OOP, DSA and more. Learn at your own pace with personalized difficulty levels.",
      keywords:
        "coding tutorials, javascript tutorial, html css tutorial, learn programming, dsa tutorial, oop tutorial, github tutorial, web development",
      openGraph: {
        title: "Learn Coding - Comprehensive Tutorials for All Levels",
        description:
          "Interactive tutorials for JavaScript, HTML, CSS, DSA, OOP, GitHub and more.",
        type: "website",
        url: "/tutorials",
      },
    };
  }
}

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
