import { useQuery } from "@tanstack/react-query";

interface TutorialNavigationData {
  current: {
    id: string;
    slug: string;
    title: string;
    order: number;
  };
  prev: {
    id: string;
    slug: string;
    title: string;
    order: number;
    difficulty: number;
    estimatedTime: number;
  } | null;
  next: {
    id: string;
    slug: string;
    title: string;
    order: number;
    difficulty: number;
    estimatedTime: number;
  } | null;
  category: {
    slug: string;
    title: string;
  } | null;
  totalInCategory: number;
  currentPosition: number;
}

interface TutorialNavigationResponse {
  success: boolean;
  data: TutorialNavigationData;
  error?: {
    code: string;
    message: string;
  };
}

export function useTutorialNavigation(slug: string, category: string) {
  return useQuery<TutorialNavigationResponse, Error>({
    queryKey: ["tutorial-navigation", slug, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        slug,
        category,
      });

      const response = await fetch(`/api/tutorials/navigation?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tutorial navigation: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!slug && !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}