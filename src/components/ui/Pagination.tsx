import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showSizeSelector?: boolean;
  sizeOptions?: number[];
  onSizeChange?: (size: number) => void;
  className?: string;
  compact?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showSizeSelector = false,
  sizeOptions = [10, 20, 50, 100],
  onSizeChange,
  className = "",
  compact = false,
}) => {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = compact ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1 && !showInfo) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items info */}
      {showInfo && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          <span className="font-medium">{startItem}</span>
          {" "}to{" "}
          <span className="font-medium">{endItem}</span>
          {" "}of{" "}
          <span className="font-medium">{totalItems}</span>
          {" "}results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {showSizeSelector && onSizeChange && (
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Show:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              aria-label="Items per page"
              title="Select number of items per page"
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-gray-900 dark:hover:text-gray-100"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          {!compact && <span className="ml-1 hidden sm:inline">Previous</span>}
        </button>

        {/* Page numbers */}
        <div className="flex">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border-t border-b border-gray-300 dark:border-gray-600 transition-colors ${
                  isCurrentPage
                    ? "bg-blue-600 text-white border-blue-600 dark:border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-gray-900 dark:hover:text-gray-100"
          }`}
          aria-label="Next page"
        >
          {!compact && <span className="mr-1 hidden sm:inline">Next</span>}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

// Compact pagination for mobile or tight spaces
export const CompactPagination: React.FC<PaginationProps> = (props) => (
  <Pagination {...props} compact={true} showInfo={false} />
);

// Simple pagination with just prev/next buttons
export const SimplePagination: React.FC<
  Pick<PaginationProps, 'currentPage' | 'totalPages' | 'onPageChange' | 'className'>
> = ({ currentPage, totalPages, onPageChange, className = "" }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        currentPage === 1
          ? "opacity-50 cursor-not-allowed"
          : "hover:text-gray-900 dark:hover:text-gray-100"
      }`}
    >
      <ChevronLeft className="w-4 h-4 mr-1" />
      Previous
    </button>
    
    <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
      Page {currentPage} of {totalPages}
    </span>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        currentPage === totalPages
          ? "opacity-50 cursor-not-allowed"
          : "hover:text-gray-900 dark:hover:text-gray-100"
      }`}
    >
      Next
      <ChevronRight className="w-4 h-4 ml-1" />
    </button>
  </div>
);
