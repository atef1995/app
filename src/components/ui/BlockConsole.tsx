import { memo, useEffect, useRef, useState } from "react";

// Block-specific console component that only listens to its own block's messages
const BlockConsole = memo(({ blockId }: { blockId: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const seenIds = useRef(new Set<number>());

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from this specific block
      if (event.data.blockId !== blockId) {
        return; // Ignore messages from other blocks
      }

      if (event.data.type === "dom-console-log" && event.data.id) {
        if (!seenIds.current.has(event.data.id)) {
          seenIds.current.add(event.data.id);
          setMessages((prev) => [...prev, event.data.message]);
          setIsVisible(true);
        }
      } else if (event.data.type === "dom-console-error" && event.data.id) {
        if (!seenIds.current.has(event.data.id)) {
          seenIds.current.add(event.data.id);
          setMessages((prev) => [...prev, `❌ Error: ${event.data.message}`]);
          setIsVisible(true);
        }
      } else if (event.data.type === "dom-console-clear") {
        // If no blockId is specified in clear message, or it matches this block
        if (!event.data.blockId || event.data.blockId === blockId) {
          setMessages([]);
          setIsVisible(false);
          seenIds.current.clear();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [blockId]);

  const clearConsole = () => {
    setMessages([]);
    setIsVisible(false);
    seenIds.current.clear();
  };

  if (!isVisible || !messages.length) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-4">
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-60 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <span>🖥️</span>
          <span className="font-bold">Console Output:</span>
          <button
            onClick={clearConsole}
            className="ml-auto text-xs text-gray-500 hover:text-gray-300 bg-gray-800 px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1">
          {messages.map((log, index) => (
            <div key={index} className="text-green-400">
              <span className="text-gray-500">{">"}</span> {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
BlockConsole.displayName = "BlockConsole";

export default BlockConsole;
