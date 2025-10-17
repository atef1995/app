import {
  Cloud,
  Zap,
  Flame,
  Brain,
  Book,
  Settings,
  Target,
  Sparkles,
  Music,
  Bell,
  Lightbulb,
  LucideIcon,
} from "lucide-react";

export function getMoodIcon(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Cloud,
    Zap,
    Flame,
    Brain,
    Book,
    Settings,
    Target,
    Sparkles,
    Music,
    Bell,
    Lightbulb,
  };

  return iconMap[iconName] || Cloud;
}
