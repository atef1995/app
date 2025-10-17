/**
 * Structured Data (JSON-LD)
 *
 * This helper generates JSON-LD structured data for search engines
 * to better understand quiz and tutorial content for rich snippets
 */

export interface QuizStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  difficulty?: string;
  educationalLevel?: string;
  author?: {
    "@type": string;
    name: string;
    url: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    ratingCount: number;
  };
}

export interface TutorialStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  author: {
    "@type": string;
    name: string;
    url: string;
  };
  educationalLevel: string;
  learningResourceType: string;
  duration?: string;
  inLanguage: string;
}

export function generateQuizStructuredData(
  quizTitle: string,
  description: string,
  quizSlug: string,
  difficulty?: string
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

  const structuredData: QuizStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Quiz",
    name: quizTitle,
    description: description,
    url: `${baseUrl}/quiz/${quizSlug}`,
    ...(difficulty && { difficulty: difficulty }),
    educationalLevel: "Beginner to Advanced",
    author: {
      "@type": "Organization",
      name: "Vibed to Cracked",
      url: baseUrl,
    },
  };

  return JSON.stringify(structuredData);
}

export function generateQuizzesPageStructuredData(quizCount: number): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    name: "Coding Quizzes",
    description: `${quizCount}+ interactive coding quizzes covering JavaScript, HTML, CSS, DSA, OOP and more`,
    url: `${baseUrl}/quizzes`,
    publisher: {
      "@type": "Organization",
      name: "Vibed to Cracked",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Interactive Quizzes",
          description: "Test your coding knowledge across multiple subjects",
          url: `${baseUrl}/quizzes`,
        },
      ],
    },
  });
}

export function generateTutorialStructuredData(
  tutorialTitle: string,
  description: string,
  category: string,
  slug: string,
  estimatedTime?: number
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

  const structuredData: TutorialStructuredData = {
    "@context": "https://schema.org/",
    "@type": "Course",
    name: tutorialTitle,
    description: description,
    url: `${baseUrl}/tutorials/category/${category}/${slug}`,
    author: {
      "@type": "Organization",
      name: "Vibed to Cracked",
      url: baseUrl,
    },
    educationalLevel: "Beginner to Advanced",
    learningResourceType: "Tutorial",
    ...(estimatedTime && {
      duration: `PT${Math.round(estimatedTime)}M`,
    }),
    inLanguage: "en-US",
  };

  return JSON.stringify(structuredData);
}

export function generateTutorialsPageStructuredData(
  tutorialCount: number
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    name: "Coding Tutorials",
    description: `${tutorialCount}+ comprehensive coding tutorials covering JavaScript, HTML, CSS, DSA, OOP and more`,
    url: `${baseUrl}/tutorials`,
    publisher: {
      "@type": "Organization",
      name: "Vibed to Cracked",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Interactive Tutorials",
          description: "Learn coding from basics to advanced",
          url: `${baseUrl}/tutorials`,
        },
      ],
    },
  });
}

export function generateCategoryStructuredData(
  categoryName: string,
  category: string,
  tutorialCount: number
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com";

  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    name: `${categoryName} Tutorials`,
    description: `${tutorialCount}+ tutorials to master ${categoryName}`,
    url: `${baseUrl}/tutorials/category/${category}`,
    publisher: {
      "@type": "Organization",
      name: "Vibed to Cracked",
      url: baseUrl,
    },
    itemListElement: {
      "@type": "ItemList",
      numberOfItems: tutorialCount,
    },
  });
}
