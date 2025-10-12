import { FC } from "react";

interface ProjectFiltersProps {
  category: string;
  difficulty: string;
  isPremium: string;
  onFilterChange: (filter: string, value: string) => void;
}

export const ProjectFilters: FC<ProjectFiltersProps> = ({
  category,
  difficulty,
  isPremium,
  onFilterChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Filters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            name="category"
            aria-label="Filter by category"
            value={category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full Stack</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty-filter"
            name="difficulty"
            aria-label="Filter by difficulty"
            value={difficulty}
            onChange={(e) => onFilterChange("difficulty", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
        </div>

        {/* Premium Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Access Type
          </label>
          <select
            id="premium-filter"
            name="premium"
            aria-label="Filter by access type"
            value={isPremium}
            onChange={(e) => onFilterChange("premium", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">All Projects</option>
            <option value="false">Free Only</option>
            <option value="true">Premium Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};
