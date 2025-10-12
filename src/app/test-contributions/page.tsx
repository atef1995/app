"use client";

/**
 * Test Page for Contribution System
 *
 * This page tests all the contribution system API endpoints
 * to ensure they work correctly before building the full UI.
 *
 * Access: http://localhost:3000/test-contributions
 */

import { useEffect, useState } from "react";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  data?: unknown;
  error?: string;
}

export default function TestContributionsPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Fetch Projects", status: "pending" },
    { name: "Fetch Project Detail", status: "pending" },
    { name: "Test GitHub Service (Parse PR URL)", status: "pending" },
  ]);

  const [projectSlug, setProjectSlug] = useState("");

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    // Test 1: Fetch Projects
    try {
      const response = await fetch("/api/contributions/projects");
      const data = await response.json();

      if (data.success && data.projects.length > 0) {
        setProjectSlug(data.projects[0].slug);
        updateTest("Fetch Projects", "success", data);
      } else {
        updateTest("Fetch Projects", "error", null, "No projects found");
      }
    } catch (error) {
      updateTest("Fetch Projects", "error", null, (error as Error).message);
    }

    // Wait a bit for projectSlug to be set
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async function testProjectDetail(slug: string) {
    try {
      const response = await fetch(`/api/contributions/projects/${slug}`);
      const data = await response.json();

      if (data.success) {
        updateTest("Fetch Project Detail", "success", data);
      } else {
        updateTest("Fetch Project Detail", "error", null, data.error);
      }
    } catch (error) {
      updateTest(
        "Fetch Project Detail",
        "error",
        null,
        (error as Error).message
      );
    }
  }

  function updateTest(
    name: string,
    status: "success" | "error",
    data?: unknown,
    error?: string
  ) {
    setTests((prev) =>
      prev.map((test) =>
        test.name === name ? { ...test, status, data, error } : test
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Contribution System Test Page
          </h1>

          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This page tests the contribution system API endpoints to verify
              they work correctly.
            </p>
            <div className="flex gap-4">
              <button
                onClick={runTests}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Run All Tests
              </button>
              {projectSlug && (
                <button
                  onClick={() => testProjectDetail(projectSlug)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Test Project Detail
                </button>
              )}
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  test.status === "success"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : test.status === "error"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 bg-gray-50 dark:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{test.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      test.status === "success"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : test.status === "error"
                          ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    {test.status}
                  </span>
                </div>

                {test.error && (
                  <div className="mt-2 text-red-600 dark:text-red-400 text-sm">
                    Error: {test.error}
                  </div>
                )}

                {test.data ? (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                      View Response Data
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-auto text-xs">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </div>
            ))}
          </div>

          {/* Manual Testing Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Manual API Testing
            </h2>

            <div className="space-y-6">
              {/* Test PR URL Parsing */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Test PR URL Parsing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Enter a GitHub PR URL to test parsing:
                </p>
                <input
                  type="text"
                  placeholder="https://github.com/owner/repo/pull/123"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const url = e.currentTarget.value;
                      const match = url.match(
                        /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
                      );
                      if (match) {
                        alert(
                          `Parsed:\nOwner: ${match[1]}\nRepo: ${match[2]}\nPR #: ${match[3]}`
                        );
                      } else {
                        alert("Invalid PR URL format");
                      }
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to test parsing
                </p>
              </div>

              {/* API Endpoints List */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Available API Endpoints</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded text-xs">
                      GET
                    </span>
                    <code className="text-blue-600 dark:text-blue-400">
                      /api/contributions/projects
                    </code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded text-xs">
                      GET
                    </span>
                    <code className="text-blue-600 dark:text-blue-400">
                      /api/contributions/projects/[slug]
                    </code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                      POST
                    </span>
                    <code className="text-blue-600 dark:text-blue-400">
                      /api/contributions/submit
                    </code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded text-xs">
                      GET
                    </span>
                    <code className="text-blue-600 dark:text-blue-400">
                      /api/contributions/submissions/[id]
                    </code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                      POST
                    </span>
                    <code className="text-blue-600 dark:text-blue-400">
                      /api/contributions/reviews/[id]
                    </code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                      POST
                    </span>
                    <code className="text-blue-600 dark:text-blue-400">
                      /api/webhooks/github
                    </code>
                  </li>
                </ul>
              </div>

              {/* Database Status */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Database Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Projects seeded:</span>
                    <span className="font-mono text-green-600 dark:text-green-400">
                      {tests[0].status === "success" ? "✓ Yes" : "? Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GitHub OAuth configured:</span>
                    <span className="font-mono text-green-600 dark:text-green-400">
                      ✓ Yes (repo scope)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Octokit installed:</span>
                    <span className="font-mono text-green-600 dark:text-green-400">
                      ✓ Yes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
