/**
 * Layout Engine for Algorithm Visualizations
 * Handles positioning and layout calculations for various data structures
 */

import { TreeNode, GraphNode } from "../types/visualizer.types";

// ============================================================================
// Tree Layout
// ============================================================================

export interface TreeLayout {
  x: number;
  y: number;
  nodeId: string;
}

/**
 * Calculate tree layout using Reingold-Tilford algorithm
 * Produces a compact, aesthetically pleasing tree layout
 */
export function calculateTreeLayout(
  root: TreeNode | null,
  width: number,
  height: number
): Map<string, TreeLayout> {
  const layout = new Map<string, TreeLayout>();
  if (!root) return layout;

  const levelHeight = height / (getTreeHeight(root) + 1);
  const nodeWidth = 40; // Width of each node
  const horizontalSpacing = 20; // Spacing between nodes

  // First pass: assign initial positions
  const positions = new Map<
    string,
    { x: number; mod: number; level: number }
  >();

  function firstPass(
    node: TreeNode | null,
    level: number,
    leftBound: number
  ): number {
    if (!node) return leftBound;

    const leftWidth = firstPass(node.left, level + 1, leftBound);
    const x = leftWidth;
    positions.set(node.id, { x, mod: 0, level });
    const rightWidth = firstPass(
      node.right,
      level + 1,
      x + nodeWidth + horizontalSpacing
    );

    return rightWidth;
  }

  firstPass(root, 0, 0);

  // Second pass: adjust for centering
  const minX = Math.min(...Array.from(positions.values()).map((p) => p.x));
  const maxX = Math.max(...Array.from(positions.values()).map((p) => p.x));
  const totalWidth = maxX - minX + nodeWidth;
  const offsetX = (width - totalWidth) / 2 - minX;

  positions.forEach((pos, id) => {
    layout.set(id, {
      x: pos.x + offsetX,
      y: pos.level * levelHeight + 30,
      nodeId: id,
    });
  });

  return layout;
}

/**
 * Calculate tree height
 */
export function getTreeHeight(node: TreeNode | null): number {
  if (!node) return -1;
  return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
}

/**
 * Simple balanced tree layout (for smaller trees)
 */
export function calculateSimpleTreeLayout(
  root: TreeNode | null,
  width: number,
  height: number
): Map<string, TreeLayout> {
  const layout = new Map<string, TreeLayout>();
  if (!root) return layout;

  const treeHeight = getTreeHeight(root);
  const levelHeight = height / (treeHeight + 2);

  function traverse(
    node: TreeNode | null,
    level: number,
    leftBound: number,
    rightBound: number
  ) {
    if (!node) return;

    const x = (leftBound + rightBound) / 2;
    const y = level * levelHeight + 30;

    layout.set(node.id, { x, y, nodeId: node.id });

    const mid = (leftBound + rightBound) / 2;
    traverse(node.left, level + 1, leftBound, mid);
    traverse(node.right, level + 1, mid, rightBound);
  }

  traverse(root, 0, 0, width);
  return layout;
}

// ============================================================================
// Graph Layout
// ============================================================================

export interface GraphLayout {
  nodes: Map<string, { x: number; y: number }>;
}

/**
 * Force-directed graph layout (simplified)
 * Uses repulsion between nodes and attraction along edges
 */
export function calculateForceDirectedLayout(
  nodes: GraphNode[],
  edges: { from: string; to: string }[],
  width: number,
  height: number,
  iterations: number = 100
): GraphLayout {
  const layout = new Map<string, { x: number; y: number }>();

  // Initialize random positions
  nodes.forEach((node) => {
    layout.set(node.id, {
      x: Math.random() * width,
      y: Math.random() * height,
    });
  });

  const k = Math.sqrt((width * height) / nodes.length); // Ideal distance
  const c1 = 2; // Repulsion constant
  const c2 = 1; // Attraction constant

  for (let iter = 0; iter < iterations; iter++) {
    const displacement = new Map<string, { dx: number; dy: number }>();

    // Initialize displacement
    nodes.forEach((node) => {
      displacement.set(node.id, { dx: 0, dy: 0 });
    });

    // Repulsion between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        const pos1 = layout.get(node1.id)!;
        const pos2 = layout.get(node2.id)!;

        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = (c1 * k * k) / distance;
        const fx = (force * dx) / distance;
        const fy = (force * dy) / distance;

        const disp1 = displacement.get(node1.id)!;
        const disp2 = displacement.get(node2.id)!;
        disp1.dx += fx;
        disp1.dy += fy;
        disp2.dx -= fx;
        disp2.dy -= fy;
      }
    }

    // Attraction along edges
    edges.forEach((edge) => {
      const pos1 = layout.get(edge.from);
      const pos2 = layout.get(edge.to);
      if (!pos1 || !pos2) return;

      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const force = (c2 * (distance * distance)) / k;
      const fx = (force * dx) / distance;
      const fy = (force * dy) / distance;

      const disp1 = displacement.get(edge.from)!;
      const disp2 = displacement.get(edge.to)!;
      disp1.dx += fx;
      disp1.dy += fy;
      disp2.dx -= fx;
      disp2.dy -= fy;
    });

    // Apply displacement with cooling
    const temp = 1 - iter / iterations;
    nodes.forEach((node) => {
      const pos = layout.get(node.id)!;
      const disp = displacement.get(node.id)!;

      const dx = disp.dx * temp;
      const dy = disp.dy * temp;

      pos.x = Math.max(50, Math.min(width - 50, pos.x + dx));
      pos.y = Math.max(50, Math.min(height - 50, pos.y + dy));
    });
  }

  return { nodes: layout };
}

/**
 * Grid layout for graphs
 * Arranges nodes in a grid pattern
 */
export function calculateGridLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): GraphLayout {
  const layout = new Map<string, { x: number; y: number }>();

  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / cols);

  const cellWidth = width / (cols + 1);
  const cellHeight = height / (rows + 1);

  nodes.forEach((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    layout.set(node.id, {
      x: (col + 1) * cellWidth,
      y: (row + 1) * cellHeight,
    });
  });

  return { nodes: layout };
}

/**
 * Circular layout for graphs
 * Arranges nodes in a circle
 */
export function calculateCircularLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): GraphLayout {
  const layout = new Map<string, { x: number; y: number }>();

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 50;

  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    layout.set(node.id, { x, y });
  });

  return { nodes: layout };
}

// ============================================================================
// Array Layout
// ============================================================================

/**
 * Calculate positions for array elements
 */
export function calculateArrayLayout(
  length: number,
  width: number,
  height: number,
  mode: "bar" | "block" = "block"
): { x: number; y: number; width: number; height: number }[] {
  const padding = 20;
  const spacing = 5;
  const availableWidth = width - 2 * padding;
  const elementWidth = (availableWidth - spacing * (length - 1)) / length;
  const maxElementWidth = 80;
  const finalElementWidth = Math.min(elementWidth, maxElementWidth);
  const totalArrayWidth = finalElementWidth * length + spacing * (length - 1);
  const startX = (width - totalArrayWidth) / 2;

  return Array.from({ length }, (_, i) => ({
    x: startX + i * (finalElementWidth + spacing),
    y: mode === "bar" ? height - 100 : height / 2 - 30,
    width: finalElementWidth,
    height: mode === "bar" ? 60 : 60,
  }));
}

// ============================================================================
// Linked List Layout
// ============================================================================

/**
 * Calculate positions for linked list nodes
 */
export function calculateLinkedListLayout(
  nodeCount: number,
  width: number,
  height: number
): { x: number; y: number }[] {
  const nodeWidth = 80;
  const spacing = 100;
  const totalWidth = nodeCount * nodeWidth + (nodeCount - 1) * spacing;
  const startX = (width - totalWidth) / 2;
  const y = height / 2;

  return Array.from({ length: nodeCount }, (_, i) => ({
    x: startX + i * (nodeWidth + spacing),
    y,
  }));
}
