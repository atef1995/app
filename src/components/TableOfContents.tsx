"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, List } from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";

// Constants
const SCROLL_OFFSET = 120;
const MOBILE_BREAKPOINT = 768;
const DEBUG_MODE = process.env.NODE_ENV === 'development';

interface TableOfContentsProps {
  content: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Utility functions
const cleanMarkdownText = (text: string): string => {
  return text
    .replace(/`([^`]+)`/g, '$1') // Remove backticks from code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
    .replace(/#$/, '') // Remove trailing #
    .trim();
};

const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const extractHeadings = (content: string): TOCItem[] => {
  if (!content) return [];

  const headingRegex = /^(#{2,4})\s+(.+?)(?:\s*{.*?})?$/gm;
  const headings: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = cleanMarkdownText(rawText);
    const id = generateId(cleanText);

    if (id && id.length > 0 && cleanText.length > 0) {
      headings.push({ level, text: cleanText, id });
    }
  }

  if (DEBUG_MODE) {
    console.log(`TOC: Extracted ${headings.length} headings from content`);
  }

  return headings;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { currentMood } = useMood();

  // Extract headings with memoization
  const tocItems = useMemo(() => extractHeadings(content), [content]);

  // Memoize mood colors
  const moodColors = useMemo(() => {
    switch (currentMood.id) {
      case "rush":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-300",
          accent: "text-red-600 dark:text-red-400",
          hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
          active: "bg-red-100 dark:bg-red-800/40 border-red-300 dark:border-red-600",
          button: "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200",
        };
      case "grind":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-300",
          accent: "text-blue-600 dark:text-blue-400",
          hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
          active: "bg-blue-100 dark:bg-blue-800/40 border-blue-300 dark:border-blue-600",
          button: "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200",
        };
      default: // chill
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-200 dark:border-purple-800",
          text: "text-purple-700 dark:text-purple-300",
          accent: "text-purple-600 dark:text-purple-400",
          hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
          active: "bg-purple-100 dark:bg-purple-800/40 border-purple-300 dark:border-purple-600",
          button: "bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200",
        };
    }
  }, [currentMood.id]);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (tocItems.length === 0) return;
      
      const scrollPosition = window.scrollY + SCROLL_OFFSET;
      let currentSection = "";

      // Find the current section by checking which heading is visible
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(tocItems[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = tocItems[i].id;
          break;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Improved scroll to section with error handling
  const scrollToSection = useCallback((id: string) => {
    try {
      if (DEBUG_MODE) {
        console.log('Scrolling to section:', id);
      }

      let element = document.getElementById(id);
      
      // If element not found, try to find the parent section
      if (!element) {
        if (DEBUG_MODE) {
          console.log('Element not found, trying parent section...');
        }
        
        const currentItem = tocItems.find(item => item.id === id);
        if (currentItem && currentItem.level > 2) {
          // Look for a parent section (level 2) above this item
          const currentIndex = tocItems.findIndex(item => item.id === id);
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (tocItems[i].level === 2) {
              const parentId = tocItems[i].id;
              element = document.getElementById(parentId);
              if (element) {
                if (DEBUG_MODE) {
                  console.log('Found parent element:', parentId);
                }
                break;
              }
            }
          }
        }
      }
      
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close TOC on mobile after clicking
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          setIsExpanded(false);
        }
      } else {
        if (DEBUG_MODE) {
          console.warn(`Section ${id} not found`);
        }
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  return (
    <>
      {/* TOC Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${moodColors.button} ${moodColors.border} border transition-colors`}
          {...(isExpanded ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' })}
          aria-controls="toc-content"
          aria-label={isExpanded ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
        >
          <List className="w-4 h-4" />
          <span className="text-sm font-medium">Table of Contents</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div 
            id="toc-content"
            className={`mt-3 p-4 rounded-lg border-2 ${moodColors.bg} ${moodColors.border}`}
          >
            <nav aria-label="Tutorial Table of Contents">
              <ul className="space-y-1" role="list">
                {tocItems.map((item) => (
                  <li key={item.id} role="listitem">
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        w-full text-left py-2 px-3 rounded transition-all duration-200 text-sm
                        ${activeSection === item.id
                          ? `${moodColors.active} font-medium`
                          : `text-gray-600 dark:text-gray-400 ${moodColors.hover}`
                        }
                        ${item.level === 2 ? 'pl-3 font-medium' :
                          item.level === 3 ? 'pl-8 text-xs' :
                          'pl-12 text-xs opacity-80'
                        }
                      `}
                      title={`Go to: ${item.text}`}
                      aria-label={`Navigate to section: ${item.text}`}
                      aria-current={activeSection === item.id ? "location" : undefined}
                    >
                      <span className="flex items-center gap-2">
                        {activeSection === item.id && (
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        )}
                        <span className="truncate">
                          {item.level === 3 && '• '}
                          {item.level === 4 && '◦ '}
                          {item.text}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click any section to jump there
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableOfContents;
