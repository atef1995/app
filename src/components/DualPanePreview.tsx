"use client";

import React, { useRef, useEffect } from "react";

interface DualPanePreviewProps {
  previewType: "html" | "api" | "full";
  frontendCode: string;
}

const DualPanePreview: React.FC<DualPanePreviewProps> = ({
  previewType,
  frontendCode,
}) => {
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  // Update preview iframe content
  const updatePreview = () => {
    if (previewFrameRef.current && previewType === "html") {
      const frameDocument = previewFrameRef.current.contentDocument;
      if (frameDocument) {
        frameDocument.open();
        frameDocument.write(frontendCode);
        frameDocument.close();
      }
    }
  };

  useEffect(() => {
    if (previewType === "html") {
      updatePreview();
    }
  }, [frontendCode, previewType]);

  return (
    <div className="w-1/2 border-l border-gray-200 dark:border-gray-600 flex flex-col">
      {/* Preview Header */}
      <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {previewType === "html"
            ? "🖼️ Live Preview"
            : "📦 Download Instructions"}
        </span>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {previewType === "html" ? (
          <iframe
            ref={previewFrameRef}
            className="w-full h-full border-none bg-white"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 h-full overflow-auto">
            <div className="space-y-4">
              {/* Simulated API Demo */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 rounded">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  🔗 API Simulation Demo
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                  Since real HTTP requests don&apos;t work in this environment,
                  here&apos;s what happens when you test the functionality:
                </p>

                <div className="space-y-2">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded text-xs">
                    <strong>✅ Connection Test:</strong>
                    <pre className="mt-1 text-blue-800 dark:text-blue-200">
                      {JSON.stringify(
                        {
                          message: "Backend server is running!",
                          timestamp: new Date().toISOString(),
                          server: "Node.js Tutorial Backend",
                          status: "healthy",
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded text-xs">
                    <strong>📦 Package Info Example:</strong>
                    <pre className="mt-1 text-green-800 dark:text-green-200">
                      {JSON.stringify(
                        {
                          name: "awesome-string-utils",
                          version: "1.0.0",
                          functions: ["capitalize", "slugify", "truncate"],
                          usage: 'StringUtils.capitalize("hello world")',
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-3 rounded">
                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                  🚀 How to Run Your Real Project:
                </h4>
                <ol className="text-xs text-amber-600 dark:text-amber-400 space-y-1">
                  <li>
                    1. Click &quot;📦 Download ZIP&quot; to get the complete
                    project
                  </li>
                  <li>2. Extract the ZIP file to your computer</li>
                  <li>
                    3. Open &quot;tutorial-project.code-workspace&quot; in VS
                    Code
                  </li>
                  <li>
                    4. Press{" "}
                    <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">
                      Ctrl+`
                    </code>{" "}
                    to open terminal
                  </li>
                  <li>
                    5. Run:{" "}
                    <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">
                      node server.js
                    </code>
                  </li>
                  <li>
                    6. Open index.html in your browser to test the frontend
                  </li>
                </ol>
              </div>

              {/* Project Overview */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📁 What&quot;s Included:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    • <strong>server.js</strong> - Your Node.js backend server
                  </li>
                  <li>
                    • <strong>index.html</strong> - Frontend with JavaScript
                  </li>
                  <li>
                    • <strong>package.json</strong> - Node.js project
                    configuration
                  </li>
                  <li>
                    • <strong>README.md</strong> - Detailed setup instructions
                  </li>
                  <li>
                    • <strong>VS Code workspace</strong> - Pre-configured for
                    development
                  </li>
                </ul>
              </div>

              {/* Learning Goals */}
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-3 rounded">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                  🎯 What You&apos;ll Learn:
                </h4>
                <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                  <li>• Creating HTTP servers with Node.js</li>
                  <li>• Building REST API endpoints</li>
                  <li>• Frontend-backend communication</li>
                  <li>• CORS handling for web requests</li>
                  <li>• Real development environment setup</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualPanePreview;
