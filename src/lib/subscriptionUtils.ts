import React from "react";
import { Crown, Zap, Settings, type LucideIcon } from "lucide-react";
import { Plan } from "@/lib/subscriptionService";

export const formatDate = (date: Date | null) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString();
};

export const formatPrice = (cents: number) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const getPlanIcon = (plan: Plan): LucideIcon => {
  switch (plan) {
    case "CRACKED":
      return Zap;
    case "VIBED":
      return Crown;
    default:
      return Settings;
  }
};

export const getPlanIconWithStyles = (plan: Plan): React.ReactElement => {
  const IconComponent = getPlanIcon(plan);
  
  switch (plan) {
    case "CRACKED":
      return React.createElement(IconComponent, { className: "w-5 h-5 text-purple-500" });
    case "VIBED":
      return React.createElement(IconComponent, { className: "w-5 h-5 text-yellow-500" });
    default:
      return React.createElement(IconComponent, { className: "w-5 h-5 text-gray-500" });
  }
};

export const getPlanColor = (plan: Plan) => {
  switch (plan) {
    case "CRACKED":
      return "from-purple-500 to-pink-500";
    case "VIBED":
      return "from-yellow-400 to-orange-500";
    default:
      return "from-gray-400 to-gray-600";
  }
};