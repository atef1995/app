"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TutorialNavigation } from "@/types/quiz";
import { devMode } from "@/lib/services/envService";

interface UseAntiCheatProps {
  tutorialNavigation: TutorialNavigation | null;
  quizSlug: string;
}

const debugMode = devMode();

export function useAntiCheat({
  tutorialNavigation,
  quizSlug,
}: UseAntiCheatProps) {
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const router = useRouter();

  const cheatMessages = useCallback(
    () => [
      "Bruh, really? 💀 Just use your brain instead of trying to copy!",
      "Caught you red-handed! 🚨 No cap, cheating ain't it chief",
      "Sus behavior detected 👀 Stop trying to cheat and actually learn!",
      "Yo, we see you! 😂 Put those copy skills toward learning JavaScript",
      "Nice try, but we're not NPCs 🤖 Close those dev tools and focus!",
      "Sheesh! 😬 Imagine trying to cheat on a learning platform...",
      "This ain't it, bestie 💅 Learn it properly or you'll get rekt later",
      "Dev tools? In MY quiz? 🤡 Close them or get yeeted out!",
      "Stop the cap! 🧢 We know you're trying to cheat - just don't!",
      "Skill issue detected 📉 Maybe try actually reading the tutorial?",
    ],
    []
  );

  const showCheatMessage = useCallback(() => {
    const messages = cheatMessages();
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const messageEl = document.createElement("div");
    messageEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ef4444;
      color: white;
      padding: 20px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      animation: shake 0.5s ease-in-out infinite;
      text-align: center;
      max-width: 400px;
    `;
    messageEl.innerHTML = `
      <div>🚨 CHEAT DETECTED 🚨</div>
      <div style="margin: 10px 0; font-size: 16px;">${randomMessage}</div>
      <div style="font-size: 14px; opacity: 0.9;">Attempt #${
        cheatAttempts + 1
      }</div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        25% { transform: translate(-50%, -50%) rotate(-2deg); }
        75% { transform: translate(-50%, -50%) rotate(2deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(messageEl);

    setCheatAttempts((prev) => prev + 1);

    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 3000);

    if (cheatAttempts >= 4) {
      setTimeout(() => {
        alert("Too many cheat attempts! Time to actually study 📚");
        const redirectSlug = tutorialNavigation?.current?.slug || quizSlug;
        router.push(`/tutorials/${redirectSlug}`);
      }, 3500);
    }
  }, [cheatAttempts, router, quizSlug, cheatMessages, tutorialNavigation]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    let devToolsOpen = false;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      let consoleOpen = false;
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          consoleOpen = true;
          throw new Error("Dev tools detected!");
        },
      });

      try {
        if (debugMode) {
          console.log(element);
        }
        console.clear();
      } catch {
        consoleOpen = true;
      }

      if ((widthThreshold || heightThreshold || consoleOpen) && !devToolsOpen) {
        devToolsOpen = true;
        showCheatMessage();

        setTimeout(() => {
          if (devToolsOpen) {
            const messages = [
              "Bruh close the dev tools 😤 This isn't inspect element simulator",
              "Console.log('stop_cheating') 💻 We see those dev tools homie",
              "Element inspector? More like skill inspector 🔍 and yours is missing!",
            ];
            alert(messages[Math.floor(Math.random() * messages.length)]);
          }
        }, 1000);
      } else if (
        !widthThreshold &&
        !heightThreshold &&
        !consoleOpen &&
        devToolsOpen
      ) {
        devToolsOpen = false;
      }
    };

    const devToolsCheckInterval = setInterval(detectDevTools, 500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey &&
          (e.key === "c" || e.key === "a" || e.key === "v" || e.key === "x")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "s")
      ) {
        e.preventDefault();
        e.stopPropagation();
        showCheatMessage();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showCheatMessage();
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showCheatMessage();
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      showCheatMessage();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    detectDevTools();

    const warningEl = document.createElement("div");
    warningEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fbbf24;
      color: #92400e;
      padding: 15px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    warningEl.innerHTML = `
      <div>⚠️ Anti-Cheat Active</div>
      <div style="font-size: 12px; margin-top: 5px; font-weight: normal;">
        We're watching 👀 No copying, dev tools, or sus behavior!
      </div>
    `;
    document.body.appendChild(warningEl);

    setTimeout(() => {
      if (document.body.contains(warningEl)) {
        document.body.removeChild(warningEl);
      }
    }, 5000);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      if (devToolsCheckInterval) {
        clearInterval(devToolsCheckInterval);
      }
    };
  }, [showCheatMessage]);

  return { cheatAttempts };
}
