"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import CodeEditor from "./CodeEditor";

interface InteractiveCodeBlockProps {
  children?: React.ReactNode;
  initialCode?: string;
  editable?: boolean;
  title?: string;
  description?: string;
  language?: string;
  height?: string;
}

const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({
  children,
  initialCode,
  editable = true,
  title,
  height = "200px",
  description,
  language = "javascript",
}) => {
  language = language?.replace(/language-/, "") || "javascript";

  // Keep nodejs/node as separate language for proper module system selection
  // but normalize for Monaco editor display
  let editorLanguage = language;
  if (language === "nodejs" || language === "node") {
    editorLanguage = "javascript"; // Monaco editor language
    // but keep original language for execution
  } else if (language === "html") {
    editable = false;
  } else if (language === "css") {
    editable = false;
  }
  // Extract code from children if provided
  const codeFromChildren = React.useMemo(() => {
    if (typeof children === "string") {
      return children.trim();
    }

    // Handle MDX children (React elements)
    if (React.isValidElement(children)) {
      // If it's a code element, extract the text content
      if (children.type === "code") {
        const props = children.props as { children?: string };
        return props.children || "";
      }
    }

    // Handle multiple children or text nodes
    if (React.Children.count(children) > 0) {
      const textContent = React.Children.toArray(children)
        .map((child) => {
          if (typeof child === "string") {
            return child;
          }
          if (React.isValidElement(child) && child.type === "code") {
            const props = child.props as { children?: string };
            return props.children || "";
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: string };
            if (typeof props.children === "string") {
              return props.children;
            }
          }
          return "";
        })
        .join("")
        .trim();

      return textContent;
    }

    return "";
  }, [children]);

  const code = initialCode || codeFromChildren;

  return (
    <div className="my-4 sm:my-6">
      {(title || description) && (
        <div className="mb-3 sm:mb-4 px-2 sm:px-0">
          {title && (
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              {description}
            </p>
          )}
        </div>
      )}

      <CodeEditor
        language={language} // Pass original language for execution logic
        initialCode={code}
        readOnly={!editable}
        height={height}
        useWebContainer={
          language === "javascript" ||
          language === "nodejs" ||
          language === "node"
        }
        placeholder={
          editable
            ? "// Try modifying this code and click Run!"
            : "// This is a code example"
        }
      />

      {editable && (
        <div className="mt-2 px-2 sm:px-0 text-xs text-wrap text-gray-500 dark:text-gray-400 flex flex-wrap items-start sm:items-center gap-1">
          <Lightbulb className="h-3 w-3 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            Tip: Modify the code above and click &ldquo;Run&rdquo; to see the
            results
          </span>
        </div>
      )}
    </div>
  );
};

export default InteractiveCodeBlock;
