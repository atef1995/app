"use client";

import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, FileText } from "lucide-react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace(/language-/, "") || "javascript";

  // Clean up the code string
  const code = String(children).replace(/\n$/, "");

  // State for copy functionality
  const [copied, setCopied] = useState(false);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [selectJoke, setSelectJoke] = useState("");
  const [showSelectJoke, setShowSelectJoke] = useState(false);
  const [jokeTimeout, setJokeTimeout] = useState<NodeJS.Timeout | null>(null);

  // Funny messages for when users try to copy
  const jokeMessages = [
    "Nice try!",
    "Copy? What's that?",
    "Nope! Type it out!",
    "Copying is for quitters!",
    "Error 404: Copy not found",
    "Did you really think I'd let you?",
    "Ctrl+C? More like Ctrl+Can't!",
    "The code is lava!",
    "Copy machine is broken",
    "This code is copy-protected!",
    "No shortcuts in learning!",
    "Type it, don't copy it!",
    "You are cooked",
  ];

  // Gen Z jokes for when users try to select text
  const selectJokes = [
    "Bro thinks they can select",
    "Not you trying to highlight rn",
    "Selection is giving delulu energy",
    "Bestie, that's not how this works",
    "You thought you ate but you left no crumbs... because you can't select",
    "This ain't it chief",
    "Selecting is so cheugy",
    "No cap, you can't select this",
    "That's lowkey embarrassing bro",
    "Selection said 'I'm not available rn'",
    "You're giving main character energy but this is my story",
    "Period. No selecting. Final answer.",
    "Sir/Ma'am this is a Wendy's... I mean, this code is unselectable",
    "Selecting? In this economy?",
    "That's gonna be a no from me dawg",
  ];

  // Handle "copy" attempt (but don't actually copy)
  const handleCopy = async () => {
    const randomIndex = Math.floor(Math.random() * jokeMessages.length);
    setJokeIndex(randomIndex);
    setCopied(true);

    // Reset after 3 seconds to show the joke longer
    setTimeout(() => setCopied(false), 3000);
  };

  // Handle selection attempts with Gen Z jokes
  const handleSelectionAttempt = () => {
    // If a joke is already showing, don't trigger a new one
    if (showSelectJoke) return;

    // Clear any existing timeout
    if (jokeTimeout) {
      clearTimeout(jokeTimeout);
    }

    const randomJoke =
      selectJokes[Math.floor(Math.random() * selectJokes.length)];
    setSelectJoke(randomJoke);
    setShowSelectJoke(true);

    // Hide the joke after 4 seconds (longer duration)
    const timeout = setTimeout(() => setShowSelectJoke(false), 4000);
    setJokeTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (jokeTimeout) {
        clearTimeout(jokeTimeout);
      }
    };
  }, [jokeTimeout]);

  // Custom style based on VS Code Dark theme
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: "#1e1e1e", // VS Code dark background
      border: "1px solid #333",
      borderRadius: "8px",
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: "#1e1e1e",
      color: "#d4d4d4", // VS Code light text
    },
    // Enhanced token colors for better visibility
    ".token.keyword": {
      color: "#569cd6", // VS Code blue for keywords (function, const, let, etc.)
      fontWeight: "normal",
    },
    ".token.string": {
      color: "#ce9178", // VS Code orange for strings
    },
    ".token.number": {
      color: "#b5cea8", // VS Code light green for numbers
    },
    ".token.boolean": {
      color: "#569cd6", // VS Code blue for booleans
    },
    ".token.function": {
      color: "#dcdcaa", // VS Code yellow for function names
    },
    ".token.variable": {
      color: "#9cdcfe", // VS Code light blue for variables
    },
    ".token.comment": {
      color: "#6a9955", // VS Code green for comments
      fontStyle: "italic",
    },
    ".token.operator": {
      color: "#d4d4d4", // Default text color for operators
    },
    ".token.punctuation": {
      color: "#d4d4d4", // Default text color for punctuation
    },
  };

  return (
    <div
      className="relative mb-6 rounded-lg overflow-hidden shadow-lg select-none"
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click
      onDragStart={(e) => e.preventDefault()} // Prevent dragging
      onMouseDown={handleSelectionAttempt} // Trigger joke when trying to select
      onMouseUp={handleSelectionAttempt} // Trigger joke when releasing selection
    >
      {/* Gen Z joke popup for selection attempts */}
      {showSelectJoke && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl border border-gray-600 z-50 pointer-events-none">
          <div className="text-sm font-medium text-center whitespace-nowrap">
            {selectJoke}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
      {/* Header bar to mimic VS Code */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Traffic light buttons */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          {/* File icon and name */}
          <div className="flex items-center space-x-2">
            <FileText size={14} className="text-gray-400" />
            <span className="text-sm text-gray-400 font-mono">
              {language === "javascript" ? "script.js" : `code.${language}`}
            </span>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200"
          title={copied ? jokeMessages[jokeIndex] : "Copy code"}
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>{jokeMessages[jokeIndex]}</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={customStyle}
        customStyle={{
          margin: 0,
          background: "#1e1e1e",
          fontSize: "14px",
          lineHeight: "1.5",
          padding: "16px",
          borderRadius: "0px 0px 0px 0px",
          userSelect: "none", // Prevent text selection
          WebkitUserSelect: "none", // Safari
          MozUserSelect: "none", // Firefox
          msUserSelect: "none", // IE/Edge
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          color: "#858585",
          backgroundColor: "#1e1e1e",
          paddingRight: "16px",
          minWidth: "2em",
          textAlign: "right",
          userSelect: "none",
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
