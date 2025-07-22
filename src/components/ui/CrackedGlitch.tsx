"use client";

import { motion } from "framer-motion";
import { ReactNode, useMemo } from "react";

interface CrackedGlitchProps {
  children?: ReactNode;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "large";
  intensity?: "low" | "medium" | "high";
}

export default function CrackedGlitch({
  children,
  text = "Cracked",
  className = "text-purple-600",
  style = {},
  size = "large",
  intensity = "medium"
}: CrackedGlitchProps) {
  // Intensity multipliers for different effect levels
  const intensityMultiplier = intensity === "low" ? 0.7 : intensity === "high" ? 1.3 : 1;
  
  // Slowed down timing configurations with intensity scaling
  const baseShakeDuration = (size === "large" ? 6 : 4) * intensityMultiplier;
  const pixelCorruptionRepeatDelay = (size === "large" ? 8 : 6) / intensityMultiplier;
  const fragmentationRepeatDelay = (size === "large" ? 10 : 8) / intensityMultiplier;
  const scanLineRepeatDelay = (size === "large" ? 12 : 9) / intensityMultiplier;
  const deadPixelRepeatDelay = (size === "large" ? 6 : 4.5) / intensityMultiplier;

  const pixelBlockCount = size === "large" ? 15 : 8;
  const largeBlockCount = size === "large" ? 5 : 3;
  const scanLineCount = size === "large" ? 8 : 4;
  const deadPixelCount = size === "large" ? 20 : 6;

  const pixelBlockSize = useMemo(
    () => (size === "large" ? { base: 2, variance: 4 } : { base: 1, variance: 2 }),
    [size]
  );
  const deadPixelSize = size === "large" ? "1px" : "0.5px";

  // Memoize pixel block styles for performance
  const pixelBlocks = useMemo(() => {
    return [...Array(pixelBlockCount)].map((_, i) => ({
      key: i,
      width: `${pixelBlockSize.base + (i % pixelBlockSize.variance)}px`,
      height: `${pixelBlockSize.base + (i % 3)}px`,
      left: `${(i * 7) % 95}%`,
      top: `${(i * 11) % 90}%`,
      backgroundColor: i % 3 === 0 ? "#ff0080" : i % 3 === 1 ? "#00ffff" : "#ffffff",
      animationDelay: i * 0.02,
      moveX: i % 2 ? 2 : -2,
      moveY: i % 3 ? 1 : -1,
    }));
  }, [pixelBlockCount, pixelBlockSize]);

  // Memoize large corruption blocks
  const largeBlocks = useMemo(() => {
    return [...Array(largeBlockCount)].map((_, i) => ({
      key: `large-${i}`,
      width: `${6 + i * 2}px`,
      height: `${4 + i}px`,
      left: `${20 + i * 18}%`,
      top: `${30 + i * 15}%`,
      backgroundColor: i % 2 === 0 ? "#8b5cf6" : "#ec4899",
      animationDelay: i * 0.04,
    }));
  }, [largeBlockCount]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        x: [0, -2, 2, -1, 1, 0, 0, 0, -1, 1, 0],
        y: [0, -1, 1, -2, 2, 0, 0, 0, -1, 1, 0],
        rotate: [0, -0.5, 0.5, -1, 1, 0, 0, 0, -0.3, 0.3, 0],
        scale: [1, 1.02, 0.98, 1.01, 0.99, 1, 1, 1, 1.005, 0.995, 1],
      }}
      transition={{
        duration: baseShakeDuration,
        repeat: Infinity,
        repeatType: "loop",
        ease: [0.4, 0, 0.6, 1],
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }}
      style={{
        filter: "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))",
        textShadow:
          "0 0 10px rgba(147, 51, 234, 0.3), 0 0 20px rgba(147, 51, 234, 0.2)",
        ...style,
      }}
    >
      {/* Pixel Corruption/Screen Break Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.4, // Doubled from 0.2
          repeat: Infinity,
          repeatDelay: pixelCorruptionRepeatDelay,
          times: [0, 0.5, 1],
        }}
      >
        {/* Corrupted Pixel Blocks */}
        {pixelBlocks.map((block) => (
          <motion.div
            key={block.key}
            className="absolute"
            style={{
              width: block.width,
              height: block.height,
              left: block.left,
              top: block.top,
              backgroundColor: block.backgroundColor,
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1.2, 0],
              x: [0, block.moveX],
              y: [0, block.moveY],
            }}
            transition={{
              duration: 0.3, // Doubled from 0.15
              delay: block.animationDelay,
              repeat: Infinity,
              repeatDelay: pixelCorruptionRepeatDelay,
            }}
          />
        ))}

        {/* Large Corruption Blocks */}
        {largeBlocks.map((block) => (
          <motion.div
            key={block.key}
            className="absolute"
            style={{
              width: block.width,
              height: block.height,
              left: block.left,
              top: block.top,
              backgroundColor: block.backgroundColor,
              filter: "blur(0.5px)",
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              scaleY: [0, 1, 1, 0],
              scaleX: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 0.24, // Doubled from 0.12
              delay: block.animationDelay,
              repeat: Infinity,
              repeatDelay: pixelCorruptionRepeatDelay,
            }}
          />
        ))}
      </motion.div>

      {/* Text Fragmentation Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.16, // Doubled from 0.08
          repeat: Infinity,
          repeatDelay: fragmentationRepeatDelay,
        }}
      >
        {/* Fragmented text pieces with different clips */}
        <motion.div
          className={`absolute inset-0 ${className}`}
          style={{
            clipPath:
              size === "large"
                ? "polygon(0% 0%, 30% 0%, 25% 40%, 5% 35%)"
                : "polygon(0% 0%, 50% 0%, 45% 100%, 0% 100%)",
          }}
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [-2, 1, -1, 0],
            y: [0, -1, 1, 0],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 0.2, // Doubled from 0.1
            repeat: Infinity,
            repeatDelay: fragmentationRepeatDelay,
          }}
        >
          {text}
        </motion.div>

        {size === "large" && (
          <>
            <motion.div
              className={`absolute inset-0 ${className}`}
              style={{
                clipPath: "polygon(30% 0%, 70% 0%, 65% 40%, 25% 40%)",
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [1, -2, 2, 0],
                y: [0, 1, -1, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.2,
                delay: 0.04, // Doubled from 0.02
                repeat: Infinity,
                repeatDelay: fragmentationRepeatDelay,
              }}
            >
              {text}
            </motion.div>

            <motion.div
              className={`absolute inset-0 ${className}`}
              style={{
                clipPath: "polygon(70% 0%, 100% 0%, 95% 40%, 65% 40%)",
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [0, 2, -1, 0],
                y: [-1, 0, 2, 0],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 0.2,
                delay: 0.08, // Doubled from 0.04
                repeat: Infinity,
                repeatDelay: fragmentationRepeatDelay,
              }}
            >
              {text}
            </motion.div>

            <motion.div
              className={`absolute inset-0 ${className}`}
              style={{
                clipPath: "polygon(0% 40%, 100% 40%, 100% 100%, 0% 100%)",
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [-1, 3, -2, 0],
                y: [1, -1, 0, 0],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 0.2,
                delay: 0.12, // Doubled from 0.06
                repeat: Infinity,
                repeatDelay: fragmentationRepeatDelay,
              }}
            >
              {text}
            </motion.div>
          </>
        )}

        {size === "small" && (
          <motion.div
            className={`absolute inset-0 ${className}`}
            style={{
              clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 45% 100%)",
            }}
            initial={{ x: 0 }}
            animate={{ x: [1, -1, 0] }}
            transition={{
              duration: 0.1, // Doubled from 0.05
              delay: 0.04, // Doubled from 0.02
              repeat: Infinity,
              repeatDelay: fragmentationRepeatDelay,
            }}
          >
            {text}
          </motion.div>
        )}
      </motion.div>

      {/* Scan Line Interference */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{
          duration: 0.2, // Doubled from 0.1
          repeat: Infinity,
          repeatDelay: scanLineRepeatDelay,
        }}
      >
        {[...Array(scanLineCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full bg-white"
            style={{
              height: "1px",
              top: `${i * 12.5}%`,
              mixBlendMode: "difference",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.3, 0],
              x: [0, i % 2 ? 10 : -10],
            }}
            transition={{
              duration: 0.1, // Doubled from 0.05
              delay: i * 0.01, // Doubled from 0.005
              repeat: Infinity,
              repeatDelay: scanLineRepeatDelay,
            }}
          />
        ))}
      </motion.div>

      {/* Dead Pixel Clusters */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.3, // Doubled from 0.15
          repeat: Infinity,
          repeatDelay: deadPixelRepeatDelay,
        }}
      >
        {[...Array(deadPixelCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-black"
            style={{
              width: deadPixelSize,
              height: deadPixelSize,
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.6, // Doubled from 0.3
              delay: i * 0.04, // Doubled from 0.02
              repeat: Infinity,
              repeatDelay: deadPixelRepeatDelay,
            }}
          />
        ))}
      </motion.div>

      {children || text}
    </motion.span>
  );
}
