import { Metadata } from "next";
import SharedAchievementClient from "./SharedAchievementClient";

// This would ideally be generated server-side for better SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // Fetch the achievement data for proper metadata
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/achievements/${id}`, {
      cache: 'no-store', // Don't cache during build
    });
    
    if (response.ok) {
      const data = await response.json();
      const achievement = data.achievement;
      const sharer = data.sharer;
      
      const title = sharer 
        ? `${sharer.name || sharer.username || 'Someone'} unlocked "${achievement.title}" - Vibed to Cracked`
        : `Achievement: ${achievement.title} - Vibed to Cracked`;
        
      const description = sharer
        ? `${sharer.name || sharer.username || 'Someone'} just unlocked the ${achievement.rarity.toLowerCase()} achievement "${achievement.title}" on Vibed to Cracked! ${achievement.description}`
        : `Check out this ${achievement.rarity.toLowerCase()} achievement: "${achievement.title}" - ${achievement.description}`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://vibed-to-cracked.com/achievements/shared/${id}`,
          siteName: "Vibed to Cracked",
          images: [
            {
              url: "/og-achievement.png", // You'd want to create this image
              width: 1200,
              height: 630,
              alt: `Achievement: ${achievement.title}`,
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: ["/og-achievement.png"],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  // Fallback metadata
  return {
    title: "Achievement Unlocked - Vibed to Cracked",
    description: "Check out this awesome coding achievement! Join Vibed to Cracked to unlock your own achievements.",
    openGraph: {
      title: "Achievement Unlocked - Vibed to Cracked",
      description: "Check out this awesome coding achievement! Join Vibed to Cracked to unlock your own achievements.",
      url: `https://vibed-to-cracked.com/achievements/shared/${id}`,
      siteName: "Vibed to Cracked",
      images: [
        {
          url: "/og-achievement.png",
          width: 1200,
          height: 630,
          alt: "Achievement Unlocked",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Achievement Unlocked - Vibed to Cracked",
      description: "Check out this awesome coding achievement! Join Vibed to Cracked to unlock your own achievements.",
      images: ["/og-achievement.png"],
    },
  };
}

export default function SharedAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  return <SharedAchievementClient params={params} />;
}
