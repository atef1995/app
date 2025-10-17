import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

    // Fetch the specific tutorial
    const response = await fetch(`${baseUrl}/api/tutorials?slug=${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Tutorial not found");
    }

    const data = await response.json();
    const tutorial = data.data?.[0];

    if (!tutorial) {
      return {
        title: "Tutorial Not Found - Vibed to Cracked",
        description: "The requested tutorial could not be found.",
      };
    }

    const tutorialTitle = tutorial.title || slug;
    const description =
      tutorial.description ||
      `Learn ${tutorialTitle.toLowerCase()}. Comprehensive tutorial covering all concepts from basics to advanced.`;
    const estimatedTime = tutorial.estimatedTime || 30;

    return {
      title: `${tutorialTitle} Tutorial - Learn in ${Math.round(
        estimatedTime
      )} Minutes | Vibed to Cracked`,
      description: `${description} Start learning now - free access for all users.`,
      keywords: `${tutorialTitle.toLowerCase()} tutorial, learn ${tutorialTitle.toLowerCase()}, ${tutorialTitle.toLowerCase()} guide, ${tutorialTitle.toLowerCase()} course`,
      openGraph: {
        title: `${tutorialTitle} - Learn With Interactive Examples`,
        description: `Master ${tutorialTitle.toLowerCase()} with our comprehensive tutorial. Takes about ${Math.round(
          estimatedTime
        )} minutes.`,
        type: "article",
        url: `/tutorials/category/${category}/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating tutorial metadata:", error);

    const formattedTitle =
      slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

    return {
      title: `${formattedTitle} Tutorial - Learn ${formattedTitle} | Vibed to Cracked`,
      description: `Comprehensive tutorial to master ${formattedTitle}. Learn at your own pace with interactive examples and challenges.`,
      keywords: `${formattedTitle.toLowerCase()} tutorial, learn ${formattedTitle.toLowerCase()}`,
      openGraph: {
        title: `${formattedTitle} Tutorial`,
        description: `Master ${formattedTitle} with our interactive tutorial.`,
        type: "article",
        url: `/tutorials/category/${category}/${slug}`,
      },
    };
  }
}

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
