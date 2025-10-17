import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

    // Fetch category metadata
    const categoryResponse = await fetch(
      `${baseUrl}/api/tutorials/categories?slug=${category}`,
      { next: { revalidate: 3600 } }
    );

    // Also fetch tutorials in this category for count
    const tutorialsResponse = await fetch(
      `${baseUrl}/api/tutorials?category=${category}`,
      { next: { revalidate: 3600 } }
    );

    if (!categoryResponse.ok || !tutorialsResponse.ok) {
      throw new Error("Failed to fetch category data");
    }

    const categoryData = await categoryResponse.json();
    const tutorialsData = await tutorialsResponse.json();

    const categoryMeta = categoryData.data?.[0];
    const tutorialCount = tutorialsData.data?.length || 0;

    if (!categoryMeta) {
      return {
        title: "Tutorials - Vibed to Cracked",
        description: "Learn programming with our comprehensive tutorials.",
      };
    }

    const categoryName = categoryMeta.name || category;

    return {
      title: `${categoryName} Tutorials - ${tutorialCount}+ Lessons | Learn ${categoryName} | Vibed to Cracked`,
      description: `Master ${categoryName} with ${tutorialCount}+ comprehensive tutorials. From fundamentals to advanced concepts, learn at your own pace with personalized difficulty levels.`,
      keywords: `${categoryName} tutorial, learn ${categoryName}, ${categoryName} guide, ${categoryName} course, ${categoryName} lessons`,
      openGraph: {
        title: `${categoryName} Tutorials - Master Your Skills`,
        description: `${tutorialCount}+ tutorials to help you master ${categoryName}.`,
        type: "website",
        url: `/tutorials/category/${category}`,
      },
    };
  } catch (error) {
    console.error("Error generating category metadata:", error);

    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

    return {
      title: `${formattedCategory} Tutorials | Learn ${formattedCategory} | Vibed to Cracked`,
      description: `Comprehensive tutorials to master ${formattedCategory}. Learn from fundamentals to advanced concepts at your own pace.`,
      keywords: `${formattedCategory} tutorial, learn ${formattedCategory}, ${formattedCategory} guide`,
      openGraph: {
        title: `${formattedCategory} Tutorials`,
        description: `Master ${formattedCategory} with our interactive tutorials.`,
        type: "website",
        url: `/tutorials/category/${category}`,
      },
    };
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
