# Algorithm Visualizer Components

A comprehensive, interactive algorithm visualization system designed to make DSA tutorials engaging and educational.

## Overview

This visualization system provides:
- **Step-by-step algorithm animations** with playback controls
- **Multiple data structure visualizers** (Arrays, Trees, Graphs, Linked Lists)
- **Mood-based theming** that adapts to user preferences (CHILL, RUSH, GRIND)
- **Interactive controls** for custom inputs and speed adjustments
- **Performance metrics** tracking (comparisons, swaps, time/space complexity)
- **MDX-ready components** for seamless tutorial integration

## Quick Start

### Basic Usage in MDX

```mdx
import { BubbleSortVisualizer } from '@/components/visualizer/examples/BubbleSortVisualizer';

# Bubble Sort Tutorial

<BubbleSortVisualizer
  initialArray={[64, 34, 25, 12, 22, 11, 90]}
  mood="CHILL"
  height={500}
/>
```

### Advanced Usage with Custom Steps

```tsx
import { AlgorithmVisualizer } from '@/components/visualizer';
import { generateBubbleSortSteps } from '@/components/visualizer';

const MyComponent = () => {
  const steps = generateBubbleSortSteps([5, 2, 8, 1, 9]);

  const config = {
    type: 'array',
    algorithm: 'Bubble Sort',
    initialData: [5, 2, 8, 1, 9],
    height: 500,
  };

  return <AlgorithmVisualizer config={config} steps={steps} mood="RUSH" />;
};
```

## Components

### Core Components

#### `AlgorithmVisualizer`
Main visualization engine that orchestrates all algorithm visualizations.

**Props:**
- `config: VisualizerConfig` - Configuration object
- `steps: Step[]` - Array of algorithm steps
- `mood?: Mood` - User's current mood (CHILL | RUSH | GRIND)
- `className?: string` - Custom CSS classes

#### `ArrayVisualizer`
Specialized visualizer for array operations.

**Props:**
- `state: ArrayState` - Current array state
- `width: number` - Visualizer width
- `height: number` - Visualizer height
- `colorScheme: ColorScheme` - Color scheme
- `mode?: 'bar' | 'block'` - Display mode
- `showIndices?: boolean` - Show array indices
- `showValues?: boolean` - Show element values

### Control Components

#### `PlaybackControls`
Provides play/pause, step controls, and progress tracking.

#### `SpeedControl`
Allows users to adjust animation speed (0.1x to 3x).

### Example Components (Ready for MDX)

#### `BubbleSortVisualizer`
Pre-configured Bubble Sort visualization.

#### `TwoPointerVisualizer`
Interactive two-pointer technique demonstration with custom inputs.

## Available Algorithm Step Generators

### Sorting Algorithms
- `generateBubbleSortSteps(arr: number[]): Step[]`
- `generateSelectionSortSteps(arr: number[]): Step[]`
- `generateInsertionSortSteps(arr: number[]): Step[]`

### Array Patterns
- `generateTwoPointerSteps(arr: number[], target: number): Step[]`
- `generateSlidingWindowSteps(arr: number[], windowSize: number): Step[]`

## Creating Custom Visualizations

### Step 1: Generate Algorithm Steps

```typescript
import { Step, ArrayState, generateStepId } from '@/components/visualizer';

function generateMyAlgorithmSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const values = [...arr];

  // Initial state
  steps.push({
    id: generateStepId(0, 'start'),
    description: 'Starting algorithm',
    state: {
      type: 'array',
      values: [...values],
    },
    metrics: {
      comparisons: 0,
      swaps: 0,
      accesses: 0,
      spaceUsed: values.length,
    },
  });

  // ... add more steps

  return steps;
}
```

### Step 2: Create Visualizer Component

```tsx
'use client';

import { AlgorithmVisualizer, VisualizerConfig } from '@/components/visualizer';
import { generateMyAlgorithmSteps } from './myAlgorithmSteps';

export function MyAlgorithmVisualizer({ initialArray }: Props) {
  const steps = generateMyAlgorithmSteps(initialArray);

  const config: VisualizerConfig = {
    type: 'array',
    algorithm: 'My Algorithm',
    initialData: initialArray,
    height: 500,
  };

  return <AlgorithmVisualizer config={config} steps={steps} />;
}
```

### Step 3: Use in MDX

```mdx
import { MyAlgorithmVisualizer } from '@/components/visualizer/examples/MyAlgorithmVisualizer';

<MyAlgorithmVisualizer initialArray={[1, 2, 3, 4, 5]} />
```

## Mood System Integration

The visualizer automatically adapts to user mood:

### CHILL Mode
- **Speed:** 0.5x (slower)
- **Colors:** Softer, pastel tones
- **Behavior:** Extended pauses, more explanatory text

### RUSH Mode
- **Speed:** 1.5x (faster)
- **Colors:** High contrast
- **Behavior:** Quick transitions, minimal text

### GRIND Mode
- **Speed:** 2.0x (fastest)
- **Colors:** Intense, focused palette
- **Behavior:** Maximum speed, code-focused

## Step Object Structure

```typescript
interface Step {
  id: string;                      // Unique identifier
  description: string;             // What's happening
  codeLine?: number;              // Line number in code
  state: DataState;               // Current data structure state
  highlights?: number[];          // Highlighted elements
  comparisons?: [number, number]; // Elements being compared
  swaps?: [number, number];       // Elements being swapped
  operation?: Operation;          // Type of operation
  variables?: Record<string, any>; // Variable values
  metrics?: StepMetrics;          // Performance metrics
}
```

## Color Scheme

Each mood has its own color scheme:

```typescript
interface ColorScheme {
  primary: string;      // Main element color
  secondary: string;    // Secondary elements
  highlight: string;    // Highlighted elements
  comparison: string;   // Elements being compared
  swap: string;         // Elements being swapped
  sorted: string;       // Sorted elements
  active: string;       // Active/current element
  inactive: string;     // Inactive elements
  background: string;   // Background color
  text: string;         // Text color
}
```

## Performance Metrics

Each step tracks:
- **Comparisons:** Number of element comparisons
- **Swaps:** Number of element swaps
- **Accesses:** Number of array accesses
- **Space Used:** Memory usage

## Layout Engine

The system includes automatic layout calculations for:

### Arrays
- Block mode (square elements)
- Bar mode (bar chart style)
- Automatic sizing and spacing

### Trees (Coming Soon)
- Reingold-Tilford algorithm
- Auto-balanced layouts
- Collision detection

### Graphs (Coming Soon)
- Force-directed layouts
- Grid layouts
- Circular layouts

## Best Practices

### 1. Keep Steps Meaningful
Each step should represent a meaningful algorithm state change:
```typescript
// ✅ Good: Clear, meaningful step
steps.push({
  description: 'Comparing 5 and 3',
  comparisons: [0, 1],
  // ...
});

// ❌ Bad: Too granular
steps.push({
  description: 'Setting variable i to 0',
  // ...
});
```

### 2. Provide Context
Include helpful descriptions:
```typescript
description: `Swapping ${values[i]} and ${values[j]} because ${values[i]} > ${values[j]}`
```

### 3. Track Metrics
Always update metrics for each step:
```typescript
metrics.comparisons++;
metrics.accesses += 2;
```

### 4. Use Highlights Wisely
Highlight only relevant elements:
```typescript
highlights: [currentIndex],
comparisons: [i, j],
```

## Extending the System

### Adding New Visualizers

1. Create new visualizer component in `/visualizer/`
2. Implement layout logic in `/utils/layoutEngine.ts`
3. Add step generator in `/utils/algorithmSteps.ts`
4. Create example wrapper in `/examples/`
5. Export from `/visualizer/index.ts`

### Adding New Data Structures

1. Define state interface in `/types/visualizer.types.ts`
2. Create visualizer component
3. Implement layout calculations
4. Add to AlgorithmVisualizer switch statement

## Troubleshooting

### Visualizer not rendering
- Check that `steps` array is not empty
- Ensure `config.type` matches the data structure in steps
- Verify all required props are provided

### Animations choppy
- Reduce animation speed
- Simplify step descriptions
- Check browser performance

### Colors not showing
- Verify mood prop is valid ("CHILL" | "RUSH" | "GRIND")
- Check colorScheme is properly passed to child components

## Future Enhancements

- [ ] Tree visualizers (Binary Tree, BST, AVL, Heap)
- [ ] Graph visualizers (DFS, BFS, Dijkstra)
- [ ] Linked List visualizers
- [ ] Code execution panel with syntax highlighting
- [ ] Complexity analyzer with graphs
- [ ] Export animations as GIF/video (premium feature)
- [ ] Challenge mode (predict next step)
- [ ] Custom data input for all visualizers

## Contributing

When adding new algorithms:
1. Create step generator function
2. Write tests for edge cases
3. Create example component
4. Update documentation
5. Add to tutorial content

## License

Part of the Vibed to Cracked learning platform.
