# Pagination System Documentation

This pagination system provides a comprehensive, reusable solution for paginating content throughout the application.

## Components

### 1. `Pagination` Component
The main pagination component with full features including page numbers, navigation, item count, and page size selection.

```tsx
import Pagination from "@/components/ui/Pagination";

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={pageSize}
  onPageChange={goToPage}
  showInfo={true}
  showSizeSelector={true}
  sizeOptions={[10, 20, 50]}
  onSizeChange={setPageSize}
/>
```

### 2. `CompactPagination` Component
A compact version suitable for mobile or tight spaces.

```tsx
import { CompactPagination } from "@/components/ui/Pagination";

<CompactPagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={pageSize}
  onPageChange={goToPage}
/>
```

### 3. `SimplePagination` Component
Basic previous/next navigation with page indicator.

```tsx
import { SimplePagination } from "@/components/ui/Pagination";

<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={goToPage}
/>
```

## Hooks

### 1. `usePagination` Hook
Basic pagination state management for client-side pagination.

```tsx
import { usePagination } from "@/hooks/usePagination";

const {
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
} = usePagination(data, {
  initialPage: 1,
  initialPageSize: 10,
  totalItems: data.length,
});
```

### 2. `useUrlPagination` Hook
Advanced pagination that syncs with URL parameters for bookmarkable pages.

```tsx
import { useUrlPagination } from "@/hooks/useUrlPagination";

const {
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  paginatedData,
  goToPage,
  setPageSize,
  isLoading,
} = useUrlPagination(data, {
  initialPage: 1,
  initialPageSize: 12,
  totalItems: data.length,
  pageParam: 'page',
  sizeParam: 'size',
});
```

## Props & Options

### Pagination Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | Required | Current active page |
| `totalPages` | `number` | Required | Total number of pages |
| `totalItems` | `number` | Required | Total number of items |
| `itemsPerPage` | `number` | Required | Items per page |
| `onPageChange` | `(page: number) => void` | Required | Page change handler |
| `showInfo` | `boolean` | `true` | Show items count info |
| `showSizeSelector` | `boolean` | `false` | Show page size selector |
| `sizeOptions` | `number[]` | `[10, 20, 50, 100]` | Available page sizes |
| `onSizeChange` | `(size: number) => void` | Optional | Page size change handler |
| `className` | `string` | `""` | Additional CSS classes |
| `compact` | `boolean` | `false` | Enable compact mode |

### Pagination Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialPage` | `number` | `1` | Starting page |
| `initialPageSize` | `number` | `10` | Starting page size |
| `totalItems` | `number` | `data.length` | Total items count |
| `pageParam` | `string` | `'page'` | URL parameter for page (URL hook only) |
| `sizeParam` | `string` | `'size'` | URL parameter for size (URL hook only) |

## Usage Examples

### Basic Client-Side Pagination

```tsx
function ProductList({ products }) {
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    setPageSize,
  } = usePagination(products, {
    initialPageSize: 12,
  });

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {paginatedData.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={goToPage}
        showSizeSelector={true}
        onSizeChange={setPageSize}
      />
    </div>
  );
}
```

### URL-Synchronized Pagination

```tsx
function SearchResults({ results }) {
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    setPageSize,
    isLoading,
  } = useUrlPagination(results, {
    initialPageSize: 20,
    pageParam: 'p',
    sizeParam: 'limit',
  });

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      
      <div className="space-y-4">
        {paginatedData.map(result => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={goToPage}
        showInfo={true}
        showSizeSelector={true}
        sizeOptions={[10, 20, 50]}
        onSizeChange={setPageSize}
      />
    </div>
  );
}
```

### Mobile-Optimized Pagination

```tsx
function MobileProductGrid({ products }) {
  const pagination = usePagination(products, { initialPageSize: 6 });

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {pagination.paginatedData.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Use compact pagination on mobile */}
      <div className="md:hidden">
        <SimplePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      </div>
      
      {/* Full pagination on desktop */}
      <div className="hidden md:block">
        <Pagination {...pagination} showSizeSelector={true} />
      </div>
    </div>
  );
}
```

## Features

- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **URL Synchronization**: Bookmarkable paginated pages
- ✅ **Dark Mode Support**: Automatic theme adaptation
- ✅ **TypeScript**: Full type safety
- ✅ **Customizable**: Multiple variants and options
- ✅ **Performance**: Efficient re-renders and memoization
- ✅ **User Experience**: Loading states and smooth transitions

## Styling

The components use Tailwind CSS classes and support dark mode out of the box. Colors follow the established design system:

- Primary: Blue (`blue-600`)
- Background: White/Gray (`white`, `gray-800`)
- Text: Gray shades
- Borders: Gray (`gray-300`, `gray-600`)
- Hover states: Lighter shades

## Best Practices

1. **Use URL pagination** for main content pages (search results, product listings)
2. **Use client pagination** for small datasets or modals
3. **Choose appropriate page sizes** based on content type:
   - Cards/Thumbnails: 12-24 items
   - Table rows: 10-50 items
   - Search results: 20-100 items
4. **Provide page size options** for user preference
5. **Show loading states** for better UX
6. **Use compact variants** on mobile devices
