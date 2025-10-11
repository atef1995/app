"use client";

import React from "react";
import { MDXRemote } from "next-mdx-remote";
import InteractiveCodeBlock from "@/components/InteractiveCodeBlock";
import { DOMInteractiveBlock } from "@/components/ui/DOMInteractiveBlock";
import { HTMLPreviewWindow } from "@/components/ui/HTMLPreviewWindow";
import { HTMLEditorPreview } from "@/components/ui/HTMLEditorPreview";
import { SeparatedEditorPreview } from "@/components/ui/SeparatedEditorPreview";
import { TwoPointerVisualizer } from "../visualizer/examples/TwoPointerVisualizer";
import TableOfContents from "@/components/TableOfContents";
import { type TutorialData } from "@/hooks/useTutorial";
import DualPaneEditor from "../DualPaneEditor";
import { ComparisonTable } from "./ComparisonTable";
import { UpgradeCTA } from "./UpgradeCTA";
import { BubbleSortVisualizer } from "../visualizer/examples/BubbleSortVisualizer";
import { SelectionSortVisualizer } from "../visualizer/examples/SelectionSortVisualizer";
import { SortingComparisonVisualizer } from "../visualizer/examples/SortingComparisonVisualizer";
import { TutorialRecommendations } from "./TutorialRecommendations";

interface TutorialContentProps {
  tutorial: TutorialData;
  contentLoaded: boolean;
}

// Helper function to generate anchor IDs from text
const generateAnchorId = (text: string): string => {
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return id;
};

// Create heading components with anchor IDs
const createHeadingComponent = (level: 1 | 2 | 3 | 4) => {
  const HeadingComponent = (
    props: React.HTMLAttributes<HTMLHeadingElement>
  ) => {
    const text =
      typeof props.children === "string"
        ? props.children
        : React.Children.toArray(props.children).join("");

    const id = generateAnchorId(text);

    const baseClasses = {
      1: "text-3xl font-bold text-gray-900 dark:text-gray-300 mb-4",
      2: "text-2xl font-semibold text-gray-800 dark:text-gray-300 mt-8 mb-4 scroll-mt-20",
      3: "text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3 scroll-mt-20",
      4: "text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2 scroll-mt-20",
    };

    const className = `${baseClasses[level]} group`;

    const headingProps = {
      id,
      className,
      ...props,
    };

    const anchorLink =
      level >= 2 ? (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          aria-label={`Link to ${text}`}
        >
          #
        </a>
      ) : null;

    switch (level) {
      case 1:
        return (
          <h1 {...headingProps}>
            {props.children}
            {anchorLink}
          </h1>
        );
      case 2:
        return (
          <h2 {...headingProps}>
            {props.children}
            {anchorLink}
          </h2>
        );
      case 3:
        return (
          <h3 {...headingProps}>
            {props.children}
            {anchorLink}
          </h3>
        );
      case 4:
        return (
          <h4 {...headingProps}>
            {props.children}
            {anchorLink}
          </h4>
        );
      default:
        return (
          <h2 {...headingProps}>
            {props.children}
            {anchorLink}
          </h2>
        );
    }
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
};

// MDX components configuration
const mdxComponents = {
  InteractiveCodeBlock,
  DOMInteractiveBlock,
  HTMLPreviewWindow,
  HTMLEditorPreview,
  SeparatedEditorPreview,
  TwoPointerVisualizer,
  DualPaneEditor,
  ComparisonTable,
  UpgradeCTA,
  BubbleSortVisualizer,
  SelectionSortVisualizer,
  SortingComparisonVisualizer,
  TutorialRecommendations,
  // Use custom heading components with anchor IDs
  h1: createHeadingComponent(1),
  h2: createHeadingComponent(2),
  h3: createHeadingComponent(3),
  h4: createHeadingComponent(4),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Check if this is an inline code or a code block
    console.log({ className: props.className });

    const isInline = !props.className;

    if (isInline) {
      // Inline code styling
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-300 text-pretty font-semibold px-3 py-1 my-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700"
          {...props}
        />
      );
    } else {
      // Block code - use SyntaxHighlighter
      // Extract only the props that SyntaxHighlighter expects
      const codeContent =
        typeof props.children === "string" ? props.children : "";
      return (
        <InteractiveCodeBlock height={"300px"} language={props.className}>
          {codeContent}
        </InteractiveCodeBlock>
      );
    }
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    // Handle code blocks wrapped in <pre>
    const hasCodeChild = React.Children.toArray(props.children).some(
      (child) => React.isValidElement(child) && child.type === "code"
    );

    if (hasCodeChild) {
      // Let the code component handle it
      return <>{props.children}</>;
    } else {
      // Regular pre block
      return <pre {...props} />;
    }
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-outside space-y-2 text-gray-600 dark:text-gray-300 mb-4 ml-6 pl-2"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-outside space-y-2 text-gray-600 dark:text-gray-300 mb-4 ml-6 pl-2"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="text-gray-600 dark:text-gray-300 leading-relaxed"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-gray-900 dark:text-blue-300" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-gray-700 dark:text-gray-300" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue-400 dark:border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic my-4 rounded-r-lg"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium transition-colors"
      {...props}
    />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="border-gray-300 dark:border-gray-600 my-8" {...props} />
  ),
};

export default function TutorialContent({
  tutorial,
  contentLoaded,
}: TutorialContentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 relative">
      {/* Add Table of Contents */}
      {tutorial.content && contentLoaded && (
        <TableOfContents content={tutorial.content} />
      )}

      {!contentLoaded ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          <div className="my-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ) : tutorial.mdxSource ? (
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote {...tutorial.mdxSource} components={mdxComponents} />
        </article>
      ) : (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
