import { FC } from "react";
import { ContributionFeature } from "@/lib/types/contribution";

interface FeatureListProps {
  features: ContributionFeature[];
}

export const FeatureList: FC<FeatureListProps> = ({ features }) => {
  return (
    <div className="space-y-6">
      {features.map((feature) => (
        <div
          key={feature.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-full">
              {feature.xpReward} XP
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {feature.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Requirements
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                {feature.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Acceptance Criteria
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                {feature.acceptanceCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Test Cases
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {feature.testCases.map((test, index) => (
                <li key={index}>{test}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
