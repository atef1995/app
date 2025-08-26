// TODO: use the mood color hook
const getMoodColors = (currentMoodId: string) => {
  switch (currentMoodId) {
    case "rush":
      return {
        gradient:
          "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
        accent:
          "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
        text: "text-red-700 dark:text-red-300",
        button: "bg-orange-500 hover:bg-orange-600",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border:
          "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20",
        lockBg: "bg-orange-500",
        hover:
          "hover:border-orange-300 dark:hover:border-orange-600 cursor-pointer",
      };
    case "grind":
      return {
        gradient:
          "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
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
      };
    default: // chill
      return {
        gradient:
          "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        accent:
          "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800",
        text: "text-purple-700 dark:text-purple-300",
        button: "bg-purple-500 hover:bg-purple-600",
        border:
          "border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20",
        lockBg: "bg-purple-500",
        hover:
          "hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer",
      };
  }
};

export default getMoodColors;
