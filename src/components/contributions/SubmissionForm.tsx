import { FC, useState } from "react";
import { ContributionFeature } from "@/lib/types/contribution";

interface SubmissionFormProps {
  feature: ContributionFeature;
  onSubmit: (prUrl: string) => Promise<void>;
  submitting?: boolean;
}

export const SubmissionForm: FC<SubmissionFormProps> = ({
  feature,
  onSubmit,
  submitting = false,
}) => {
  const [prUrl, setPrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(prUrl);
      setPrUrl(""); // Reset form on success
    } catch (err) {
      setError((err as Error).message || "Failed to submit PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="pr-url"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Pull Request URL
        </label>
        <div className="flex space-x-4">
          <input
            type="url"
            id="pr-url"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/pull/123"
            pattern="https://github\.com/[^/]+/[^/]+/pull/\d+"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={loading || submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading || submitting ? "Submitting..." : "Submit PR"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Before submitting, make sure:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Your PR follows the contribution guidelines</li>
          <li>All tests are passing</li>
          <li>Code meets the acceptance criteria</li>
          <li>PR description includes necessary details</li>
        </ul>
      </div>
    </form>
  );
};
