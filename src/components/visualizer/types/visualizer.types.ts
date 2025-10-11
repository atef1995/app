/**
 * Type definitions for algorithm visualization components
 * These types support various data structures and algorithm visualizations
 */

// ============================================================================
// Core Visualization Types
// ============================================================================

/**
 * Represents a single step in an algorithm execution
 */
export interface Step {
  /** Unique identifier for the step */
  id: string;
  /** Description of what's happening in this step */
  description: string;
  /** Line number in code being executed (if applicable) */
  codeLine?: number;
  /** Current state of the data structure */
  state: DataState;
  /** Elements to highlight in this step */
  highlights?: number[];
  /** Elements being compared */
  comparisons?: [number, number];
  /** Elements being swapped */
  swaps?: [number, number];
  /** Operation being performed */
  operation?: Operation;
  /** Variables and their values at this step */
  variables?: Record<string, number>;
  /** Performance metrics */
  metrics?: StepMetrics;
}

/**
 * Performance metrics for a step
 */
export interface StepMetrics {
  comparisons: number;
  swaps: number;
  accesses: number;
  spaceUsed: number;
}

/**
 * Types of operations that can be performed
 */
export type Operation =
  | "compare"
  | "swap"
  | "access"
  | "insert"
  | "delete"
  | "update"
  | "traverse"
  | "split"
  | "merge"
  | "partition";

/**
 * State of the data structure at a given step
 */
export type DataState = ArrayState | TreeState | GraphState | LinkedListState;

// ============================================================================
// Array Visualization Types
// ============================================================================

export interface ArrayState {
  type: "array";
  values: number[];
  /** Active pointers (e.g., for two-pointer technique) */
  pointers?: Pointer[];
  /** Window for sliding window pattern */
  window?: { start: number; end: number };
  /** Partitions for divide-and-conquer algorithms */
  partitions?: Partition[];
  /** Sorted regions */
  sorted?: boolean[];
}

export interface Pointer {
  index: number;
  label: string;
  color?: string;
}

export interface Partition {
  start: number;
  end: number;
  label?: string;
  color?: string;
}

// ============================================================================
// Tree Visualization Types
// ============================================================================

export interface TreeState {
  type: "tree";
  root: TreeNode | null;
  /** Currently highlighted nodes */
  highlightedNodes?: string[];
  /** Path being traversed */
  traversalPath?: string[];
  /** Type of tree */
  treeType?: "binary" | "bst" | "avl" | "redblack" | "heap";
}

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  /** Additional properties for specific tree types */
  height?: number; // For AVL trees
  color?: "red" | "black"; // For Red-Black trees
  parent?: string; // Parent node ID
}

// ============================================================================
// Graph Visualization Types
// ============================================================================

export interface GraphState {
  type: "graph";
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Type of graph */
  graphType?: "directed" | "undirected";
  /** Currently highlighted path */
  highlightedPath?: string[];
  /** Visited nodes */
  visited?: Set<string>;
  /** Distances for shortest path algorithms */
  distances?: Record<string, number>;
}

export interface GraphNode {
  id: string;
  value: number | string;
  /** Position for layout */
  x?: number;
  y?: number;
  /** Visual state */
  state?: "unvisited" | "visiting" | "visited";
  /** Distance from source (for shortest path) */
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  /** Whether this edge is highlighted */
  highlighted?: boolean;
  /** Edge state */
  state?: "inactive" | "active" | "selected";
}

// ============================================================================
// Linked List Visualization Types
// ============================================================================

export interface LinkedListState {
  type: "linkedlist";
  head: LinkedListNode | null;
  /** Type of linked list */
  listType?: "singly" | "doubly" | "circular";
  /** Currently highlighted nodes */
  highlightedNodes?: string[];
  /** Active pointers */
  pointers?: { nodeId: string; label: string; color?: string }[];
}

export interface LinkedListNode {
  id: string;
  value: number;
  next: LinkedListNode | null;
  prev?: LinkedListNode | null; // For doubly linked lists
}

// ============================================================================
// Visualizer Configuration
// ============================================================================

export interface VisualizerConfig {
  /** Type of visualization */
  type: "array" | "tree" | "graph" | "linkedlist" | "stack" | "queue";
  /** Algorithm being visualized */
  algorithm: string;
  /** Initial data */
  initialData: Array<number>;
  /** Whether to show code alongside */
  showCode?: boolean;
  /** Whether to show complexity analysis */
  showComplexity?: boolean;
  /** Allow user to input custom data */
  interactive?: boolean;
  /** Height of visualizer */
  height?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Color scheme */
  colorScheme?: ColorScheme;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  highlight: string;
  comparison: string;
  swap: string;
  sorted: string;
  active: string;
  inactive: string;
  background: string;
  text: string;
}

// ============================================================================
// Animation State
// ============================================================================

export interface AnimationState {
  /** Current step index */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Animation speed (0.1x to 3x) */
  speed: number;
  /** All recorded steps */
  steps: Step[];
  /** Current state */
  currentState: DataState;
}

// ============================================================================
// Playback Controls
// ============================================================================

export interface PlaybackControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStep: (step: number) => void;
  setSpeed: (speed: number) => void;
}

// ============================================================================
// Algorithm Metadata
// ============================================================================

export interface AlgorithmMetadata {
  name: string;
  category: "sorting" | "searching" | "traversal" | "pathfinding" | "other";
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  /** Code snippet */
  code?: string;
}

// ============================================================================
// Complexity Analysis
// ============================================================================

export interface ComplexityData {
  /** Total operations performed */
  totalOperations: number;
  /** Breakdown by operation type */
  operationBreakdown: {
    comparisons: number;
    swaps: number;
    accesses: number;
    insertions: number;
    deletions: number;
  };
  /** Space used */
  spaceUsed: number;
  /** Time complexity */
  timeComplexity: string;
  /** Space complexity */
  spaceComplexity: string;
  /** Input size */
  inputSize: number;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Mood types from the existing mood system
 */
export type Mood = "CHILL" | "RUSH" | "GRIND";

/**
 * Configuration for mood-based behavior
 */
export interface MoodConfig {
  mood: Mood;
  defaultSpeed: number;
  showExplanations: boolean;
  colorIntensity: "low" | "medium" | "high";
}
