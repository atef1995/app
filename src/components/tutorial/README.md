# Tutorial Components

Reusable, beautiful components for MDX tutorials.

## Components

### ComparisonTable

A responsive, feature-rich comparison table component perfect for showing algorithm complexity comparisons.

#### Features

- ✅ **Responsive Design** - Card layout on mobile, table on desktop
- ✅ **Dark Mode Support** - Automatically adapts to theme
- ✅ **Auto-formatting** - Complexity notation (O(n), O(1)) gets color-coded badges
- ✅ **Visual Hierarchy** - Zebra striping, gradient headers
- ✅ **Highlight Support** - Highlight recommended rows or columns
- ✅ **Interactive** - Hover effects on rows
- ✅ **Accessible** - Semantic HTML, proper ARIA labels

#### Basic Usage

```tsx
import { ComparisonTable } from '@/components/tutorial/ComparisonTable';

<ComparisonTable
  headers={['Approach', 'Time Complexity', 'Space Complexity', 'When to Use']}
  rows={[
    {
      label: 'Brute Force',
      values: ['O(n²)', 'O(1)', 'Never (if two-pointer works)']
    },
    {
      label: 'Two Pointers',
      values: ['O(n)', 'O(1)', 'Sorted arrays, optimization'],
      highlighted: true
    },
    {
      label: 'Hash Map',
      values: ['O(n)', 'O(n)', 'Unsorted arrays, one-pass']
    }
  ]}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `string[]` | Required | Column headers |
| `rows` | `ComparisonRow[]` | Required | Table rows with data |
| `highlightColumn` | `number` | - | Index of column to highlight (0-based) |
| `variant` | `'default' \| 'compact' \| 'bordered'` | `'default'` | Visual variant |
| `className` | `string` | `''` | Additional CSS classes |
| `caption` | `string` | - | Table caption/description |

#### ComparisonRow Interface

```typescript
interface ComparisonRow {
  label: string;                    // Row label (first column)
  values: (string | ComparisonValue)[]; // Cell values
  highlighted?: boolean;            // Highlight this entire row
}
```

#### ComparisonValue Interface

For advanced cell customization:

```typescript
interface ComparisonValue {
  value: string;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: 'check' | 'cross' | 'info';
}
```

#### Variants

**Default**
```tsx
<ComparisonTable variant="default" ... />
```
- Standard padding
- Clean design

**Compact**
```tsx
<ComparisonTable variant="compact" ... />
```
- Reduced padding
- More data in less space

**Bordered**
```tsx
<ComparisonTable variant="bordered" ... />
```
- Stronger borders
- More visual separation

#### Complexity Color Coding

The component automatically color-codes Big-O notation:

- `O(1)` - 🟢 Green (Excellent)
- `O(n)` - 🔵 Blue (Good)
- `O(n log n)` - 🟡 Yellow (Fair)
- `O(n²)` - 🟠 Orange (Slow)
- `O(n³)`, `O(2ⁿ)` - 🔴 Red (Very Slow)

#### Advanced Example

```tsx
<ComparisonTable
  caption="Algorithm Performance Comparison"
  headers={['Algorithm', 'Best Case', 'Average Case', 'Worst Case', 'Space']}
  rows={[
    {
      label: 'Bubble Sort',
      values: ['O(n)', 'O(n²)', 'O(n²)', 'O(1)']
    },
    {
      label: 'Quick Sort',
      values: ['O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      highlighted: true
    },
    {
      label: 'Merge Sort',
      values: ['O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)']
    }
  ]}
  variant="bordered"
  highlightColumn={2}
/>
```

#### Custom Value Styling

```tsx
<ComparisonTable
  headers={['Feature', 'Available']}
  rows={[
    {
      label: 'Fast Execution',
      values: [
        {
          value: 'Yes',
          variant: 'success',
          icon: 'check'
        }
      ]
    },
    {
      label: 'Memory Intensive',
      values: [
        {
          value: 'No',
          variant: 'danger',
          icon: 'cross'
        }
      ]
    }
  ]}
/>
```

## Best Practices

1. **Use for Comparisons** - Perfect for algorithm comparisons, complexity tables, feature matrices
2. **Keep Headers Short** - Long headers don't display well on mobile
3. **Highlight Wisely** - Only highlight the recommended/best option
4. **Provide Context** - Use the `caption` prop to explain what's being compared
5. **Consistent Data** - Ensure all rows have the same number of values as headers (minus the label column)

## Mobile Behavior

On screens smaller than `md` breakpoint (768px), the table automatically transforms into a card layout:
- Each row becomes a card
- Headers become labels within each card
- Maintains all styling and highlighting
- Optimized for touch interaction

## Examples in Tutorials

See it in action:
- `src/content/tutorials/data-structures/02-two-pointer-technique.mdx` (line 129)
