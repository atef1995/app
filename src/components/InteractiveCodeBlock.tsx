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
}

const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({
  children,
  initialCode,
  editable = true,
  title,
  description,
}) => {
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
    <div className="my-6">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {description}
            </p>
          )}
        </div>
      )}

      <CodeEditor
        initialCode={code}
        readOnly={!editable}
        height="250px"
        placeholder={
          editable
            ? "// Try modifying this code and click Run!"
            : "// This is a code example"
        }
      />

      {editable && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Lightbulb className="h-3 w-3" />
          Tip: Modify the code above and click &ldquo;Run&rdquo; to see the
          results, or use Ctrl+Enter
        </div>
      )}
    </div>
  );
};

export default InteractiveCodeBlock;
