"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Eye, EyeOff, RotateCcw, Code, Play, Copy, Check } from "lucide-react";

interface HTMLEditorPreviewProps {
  initialHtml: string;
  css?: string;
  javascript?: string;
  title?: string;
  height?: number;
  editable?: boolean;
  forceUpdateTrigger?: number;
}

export function HTMLEditorPreview({
  initialHtml,
  css = "",
  javascript = "",
  title = "HTML Editor & Preview",
  height = 300,
  editable = true,
  forceUpdateTrigger = 0,
}: HTMLEditorPreviewProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [html, setHtml] = useState(initialHtml);
  const [srcDoc, setSrcDoc] = useState("");
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Update force update counter when trigger changes
    setForceUpdate(forceUpdateTrigger);
  }, [forceUpdateTrigger]);

  // Reset HTML to initial value when initialHtml changes
  useEffect(() => {
    setHtml(initialHtml);
  }, [initialHtml]);

  const generateHTML = useCallback(
    (htmlContent: string, includeJS: boolean = true) => {
      const timestamp = Date.now();
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
            background: #f8fafc;
        }
        
        /* Default styles for demo elements */
        .box {
            width: 100px;
            height: 100px;
            background: #3b82f6;
            margin: 10px;
            display: inline-block;
            border-radius: 8px;
        }
        
        .message {
            padding: 12px;
            margin: 10px 0;
            border-radius: 6px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
        }
        
        .visible {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .hidden {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .highlighted {
            background: #fef3c7;
            border-color: #f59e0b;
        }
        
        .new-box {
            padding: 12px;
            margin: 8px 0;
            background: #dcfce7;
            border: 2px solid #16a34a;
            border-radius: 6px;
            color: #166534;
        }
        
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin: 4px;
            font-size: 14px;
        }
        
        button:hover {
            background: #2563eb;
        }
        
        input, textarea, select {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            margin: 4px;
        }
        
        .item {
            padding: 8px;
            margin: 4px 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        
        ${css}
    </style>
</head>
<body>
    ${htmlContent}
    ${
      includeJS
        ? `
    <script>
        // Timestamp: ${timestamp} - Force update: ${forceUpdate}
        try {
            ${javascript}
        } catch (error) {
            console.error('Preview Error:', error);
        }
    </script>`
        : ""
    }
</body>
</html>`;
    },
    [css, javascript, forceUpdate]
  );

  useEffect(() => {
    // Only update srcDoc on client side to prevent hydration issues
    if (!isMounted) return;

    const fullHTML = generateHTML(html, true);
    setSrcDoc(fullHTML);

    // Force iframe refresh by setting srcDoc twice with slight delay
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = fullHTML;
      }
    }, 50);
  }, [generateHTML, html, isMounted]);

  const resetPreview = () => {
    setHtml(initialHtml);
    // Force re-render of the iframe
    const fullHTML = generateHTML(initialHtml, false);
    setSrcDoc(fullHTML);

    // Force iframe refresh
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = fullHTML;
      }
    }, 100);
  };

  const runCode = () => {
    // Force update the preview with current HTML
    const fullHTML = generateHTML(html, true);
    setSrcDoc(fullHTML);

    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = fullHTML;
      }
    }, 50);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);


  useEffect(() => {
    if (showEditor) {
      adjustTextareaHeight();
    }
  }, [html, showEditor, adjustTextareaHeight]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {editable && (
            <>
              <button
                onClick={copyCode}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                title="Copy HTML"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={runCode}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                title="Run Code"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded ${
                  showEditor
                    ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
                    : "text-gray-600 dark:text-gray-400"
                }`}
                title={showEditor ? "Hide Editor" : "Show Editor"}
              >
                <Code className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={resetPreview}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
            title="Reset to Original"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
            title={isVisible ? "Hide Preview" : "Show Preview"}
          >
            {isVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor (if enabled and visible) */}
      {editable && showEditor && (
        <div className="border-b border-gray-200 dark:border-gray-600">
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <span>
              HTML Editor - Edit the code below and click Run to see changes
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={html}
            onChange={(e) => {
              setHtml(e.target.value);
              adjustTextareaHeight();
            }}
            onInput={adjustTextareaHeight}
            className="w-full p-4 font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            style={{ minHeight: "120px" }}
            placeholder="Enter your HTML code here..."
            spellCheck={false}
          />
        </div>
      )}

      {/* Preview Content */}
      {isVisible && (
        <div className="relative">
          {isMounted ? (
            <iframe
              ref={iframeRef}
              className="w-full border-none"
              style={{ height: `${height}px` }}
              title="HTML Preview"
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              key={`iframe-${forceUpdate}-${Date.now()}`}
            />
          ) : (
            <div
              className="w-full flex items-center justify-center bg-gray-50 dark:bg-gray-700"
              style={{ height: `${height}px` }}
            >
              <div className="text-gray-500 dark:text-gray-400">
                Loading preview...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
