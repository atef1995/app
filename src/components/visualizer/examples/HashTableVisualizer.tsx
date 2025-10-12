"use client";

import React, { useState } from "react";

/**
 * HashTableVisualizer Component
 *
 * Interactive visualizer for hash table operations with chaining.
 * Shows how keys are hashed to indices and how collisions are handled.
 *
 * **Features:**
 * - Visual hash function computation
 * - Bucket array display
 * - Chaining for collision resolution
 * - Interactive insert/search/delete operations
 * - Load factor tracking
 * - Collision highlighting
 *
 * **Educational Focus:**
 * - Demonstrates O(1) average-case lookup
 * - Shows collision resolution with chaining
 * - Visualizes load factor impact
 * - Highlights hash distribution
 *
 * @example
 * ```tsx
 * <HashTableVisualizer
 *   initialSize={10}
 *   mood="CHILL"
 * />
 * ```
 */

interface HashEntry {
  key: string;
  value: string;
}

interface Mood {
  CHILL: string;
  RUSH: string;
  GRIND: string;
}

interface HashTableVisualizerProps {
  /** Initial size of hash table array */
  initialSize?: number;
  /** User's mood for theming */
  mood?: keyof Mood;
  /** Custom className */
  className?: string;
}

export function HashTableVisualizer({
  initialSize = 10,
  mood = "CHILL",
  className,
}: HashTableVisualizerProps) {
  const [size] = useState(initialSize);
  const [buckets, setBuckets] = useState<HashEntry[][]>(
    Array(initialSize)
      .fill(null)
      .map(() => [])
  );
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [lastOperation, setLastOperation] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Simple hash function (djb2)
  const hash = (key: string): number => {
    let hashValue = 5381;
    for (let i = 0; i < key.length; i++) {
      hashValue = (hashValue << 5) + hashValue + key.charCodeAt(i);
    }
    return Math.abs(hashValue % size);
  };

  // Calculate load factor
  const getLoadFactor = (): number => {
    const totalEntries = buckets.reduce((sum, bucket) => sum + bucket.length, 0);
    return totalEntries / size;
  };

  // Insert operation
  const handleInsert = () => {
    if (!inputKey || !inputValue) {
      setLastOperation("⚠️ Please provide both key and value");
      return;
    }

    const index = hash(inputKey);
    const newBuckets = [...buckets];
    const bucket = newBuckets[index];

    // Check if key exists (update)
    const existingIndex = bucket.findIndex((entry) => entry.key === inputKey);
    if (existingIndex !== -1) {
      bucket[existingIndex].value = inputValue;
      setLastOperation(
        `✏️ Updated "${inputKey}" at index ${index} (hash: ${hash(inputKey)})`
      );
    } else {
      // Insert new entry
      bucket.push({ key: inputKey, value: inputValue });
      const isCollision = bucket.length > 1;
      setLastOperation(
        `✅ Inserted "${inputKey}" → "${inputValue}" at index ${index} (hash: ${hash(
          inputKey
        )})${isCollision ? " ⚠️ COLLISION - Added to chain!" : ""}`
      );
    }

    setBuckets(newBuckets);
    setHighlightedIndex(index);
    setInputKey("");
    setInputValue("");

    // Clear highlight after animation
    setTimeout(() => setHighlightedIndex(null), 2000);
  };

  // Search operation
  const handleSearch = () => {
    if (!searchKey) {
      setLastOperation("⚠️ Please provide a key to search");
      return;
    }

    const index = hash(searchKey);
    const bucket = buckets[index];
    const entry = bucket.find((e) => e.key === searchKey);

    setHighlightedIndex(index);

    if (entry) {
      setLastOperation(
        `🔍 Found "${searchKey}" → "${entry.value}" at index ${index} (${bucket.length} item(s) in chain)`
      );
    } else {
      setLastOperation(
        `❌ Key "${searchKey}" not found at index ${index} (searched ${bucket.length} item(s) in chain)`
      );
    }

    setTimeout(() => setHighlightedIndex(null), 2000);
  };

  // Delete operation
  const handleDelete = () => {
    if (!searchKey) {
      setLastOperation("⚠️ Please provide a key to delete");
      return;
    }

    const index = hash(searchKey);
    const newBuckets = [...buckets];
    const bucket = newBuckets[index];
    const entryIndex = bucket.findIndex((e) => e.key === searchKey);

    if (entryIndex !== -1) {
      bucket.splice(entryIndex, 1);
      setBuckets(newBuckets);
      setLastOperation(
        `🗑️ Deleted "${searchKey}" from index ${index} (${bucket.length} item(s) remaining in chain)`
      );
      setHighlightedIndex(index);
      setTimeout(() => setHighlightedIndex(null), 2000);
    } else {
      setLastOperation(`❌ Key "${searchKey}" not found, nothing to delete`);
    }
  };

  // Clear all
  const handleClear = () => {
    setBuckets(
      Array(size)
        .fill(null)
        .map(() => [])
    );
    setLastOperation("🧹 Cleared all entries");
    setHighlightedIndex(null);
  };

  // Load example data
  const loadExample = () => {
    const examples = [
      { key: "Alice", value: "95" },
      { key: "Bob", value: "88" },
      { key: "Carol", value: "92" },
      { key: "Dave", value: "78" },
      { key: "Eve", value: "85" },
    ];

    const newBuckets: HashEntry[][] = Array(size)
      .fill(null)
      .map(() => []);

    examples.forEach(({ key, value }) => {
      const index = hash(key);
      newBuckets[index].push({ key, value });
    });

    setBuckets(newBuckets);
    setLastOperation("📚 Loaded example data (5 entries)");
  };

  const loadFactor = getLoadFactor();
  const loadFactorColor =
    loadFactor < 0.5
      ? "text-green-600"
      : loadFactor < 0.75
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className={className}>
      {/* Controls */}
      <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
          🎮 Hash Table Operations
        </h4>

        {/* Insert */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Key (e.g., Alice)"
              className="px-3 py-2 border border-purple-300 dark:border-purple-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              placeholder="Value (e.g., 95)"
              className="px-3 py-2 border border-purple-300 dark:border-purple-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleInsert}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition"
            >
              Insert
            </button>
          </div>

          {/* Search/Delete */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Key to search/delete"
              className="px-3 py-2 border border-purple-300 dark:border-purple-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
            >
              Search
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
            >
              Delete
            </button>
          </div>

          {/* Utility buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
            >
              Load Example
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Operation feedback */}
        {lastOperation && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-700">
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {lastOperation}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {size}
            </div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Array Size
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {buckets.reduce((sum, b) => sum + b.length, 0)}
            </div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Total Entries
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${loadFactorColor}`}>
              {loadFactor.toFixed(2)}
            </div>
            <div className="text-xs text-blue-800 dark:text-blue-200">
              Load Factor
            </div>
          </div>
        </div>
      </div>

      {/* Hash table visualization */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Hash Table Buckets (Chaining)
        </h4>
        <div className="space-y-2">
          {buckets.map((bucket, index) => (
            <div
              key={index}
              className={`flex items-start p-2 rounded transition-colors ${
                highlightedIndex === index
                  ? "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Index */}
              <div className="w-12 flex-shrink-0 font-mono text-sm font-semibold text-gray-600 dark:text-gray-400">
                [{index}]
              </div>

              {/* Bucket chain */}
              <div className="flex-1 flex flex-wrap gap-2">
                {bucket.length === 0 ? (
                  <span className="text-gray-400 dark:text-gray-600 text-sm italic">
                    empty
                  </span>
                ) : (
                  bucket.map((entry, entryIndex) => (
                    <div
                      key={entryIndex}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 rounded"
                    >
                      <span className="text-sm font-mono">
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          {entry.key}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          →{" "}
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">
                          {entry.value}
                        </span>
                      </span>
                      {entryIndex < bucket.length - 1 && (
                        <span className="ml-2 text-purple-400">→</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Collision indicator */}
              {bucket.length > 1 && (
                <div className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded border border-red-300 dark:border-red-700">
                  Collision ({bucket.length})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Educational notes */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          📚 How It Works
        </h4>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>
            • <strong>Hash Function:</strong> Converts key → array index (djb2
            algorithm)
          </li>
          <li>
            • <strong>Chaining:</strong> Each bucket holds a list of entries
            (handles collisions)
          </li>
          <li>
            • <strong>Insert:</strong> Hash key, add to bucket chain - O(1)
            average
          </li>
          <li>
            • <strong>Search:</strong> Hash key, search in chain - O(1) average
          </li>
          <li>
            • <strong>Load Factor:</strong> entries/size - Keep below 0.75 for
            best performance
          </li>
          <li>
            • <strong>Collisions:</strong> Multiple keys hash to same index -
            normal and expected!
          </li>
        </ul>
      </div>
    </div>
  );
}
