// TODO: use the mood color hook
const getMoodColors = (currentMoodId: string) => {
  switch (currentMoodId) {
    case "rush":
      return {
        gradient:
          "from-yellow-50 via-yellow-50 to-yellow-50 dark:from-yellow-900/20 dark:via-yellow-900/20 dark:to-yellow-900/20",
        accent:
          "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800",
        text: "text-yellow-700 dark:text-yellow-300",
        button: "bg-yellow-500 hover:bg-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border:
          "border-yellow-300 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500/20",
        lockBg: "bg-yellow-500",
        hover:
          "hover:border-yellow-300 dark:hover:border-yellow-600 cursor-pointer",
        badge:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300",
      };
    case "grind":
      return {
        gradient:
          "from-gray-50 via-slate-50 to-red-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-red-900/20",
        bg: "bg-red-50 dark:bg-red-900/20",
        accent:
          "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
        text: "text-red-700 dark:text-red-300",
        button: "bg-red-500 hover:bg-red-600",
        border:
          "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20",
        lockBg: "bg-red-500",
        hover: "hover:border-red-300 dark:hover:border-red-600 cursor-pointer",
        badge: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
      };
    default: // chill
      return {
        gradient:
          "from-blue-50 via-pink-50 to-indigo-50 dark:from-blue-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        accent:
          "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
        text: "text-blue-700 dark:text-blue-300",
        button: "bg-blue-500 hover:bg-blue-600",
        border:
          "border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500/20",
        lockBg: "bg-blue-500",
        hover:
          "hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer",
        badge: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
      };
  }
};

export default getMoodColors;
