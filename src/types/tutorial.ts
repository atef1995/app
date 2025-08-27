export interface TutorialNavigationData {
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
