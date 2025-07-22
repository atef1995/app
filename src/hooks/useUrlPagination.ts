import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UseUrlPaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
  pageParam?: string;
  sizeParam?: string;
}

export interface UseUrlPaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedData: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  startIndex: number;
  endIndex: number;
  isLoading: boolean;
}

/**
 * Pagination hook that synchronizes with URL search parameters
 * This allows users to bookmark paginated pages and share links
 */
export function useUrlPagination<T>(
  data: T[],
  options: UseUrlPaginationOptions
): UseUrlPaginationReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems = data.length,
    pageParam = 'page',
    sizeParam = 'size',
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Get initial values from URL
  const urlPage = parseInt(searchParams.get(pageParam) || '') || initialPage;
  const urlPageSize = parseInt(searchParams.get(sizeParam) || '') || initialPageSize;

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSizeState] = useState(urlPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  // Calculate pagination bounds
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  // Get current page data
  const paginatedData = data.slice(startIndex, endIndex);

  // Update URL when pagination changes
  const updateUrl = useCallback((page: number, size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === initialPage) {
      params.delete(pageParam);
    } else {
      params.set(pageParam, page.toString());
    }
    
    if (size === initialPageSize) {
      params.delete(sizeParam);
    } else {
      params.set(sizeParam, size.toString());
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl, { scroll: false });
  }, [router, searchParams, pageParam, sizeParam, initialPage, initialPageSize]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (validPage !== currentPage) {
      setIsLoading(true);
      setCurrentPage(validPage);
      updateUrl(validPage, pageSize);
      // Simulate loading delay for better UX
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [currentPage, totalPages, pageSize, updateUrl]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const setPageSize = useCallback((size: number) => {
    setIsLoading(true);
    setPageSizeState(size);
    // Reset to first page when changing page size
    setCurrentPage(1);
    updateUrl(1, size);
    setTimeout(() => setIsLoading(false), 100);
  }, [updateUrl]);

  // Sync with URL changes (browser back/forward)
  useEffect(() => {
    const urlPage = parseInt(searchParams.get(pageParam) || '') || initialPage;
    const urlPageSize = parseInt(searchParams.get(sizeParam) || '') || initialPageSize;
    
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
    if (urlPageSize !== pageSize) {
      setPageSizeState(urlPageSize);
    }
  }, [searchParams, pageParam, sizeParam, initialPage, initialPageSize, currentPage, pageSize]);

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    isLoading,
  };
}
