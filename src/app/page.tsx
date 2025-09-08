"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves,
  Wind,
  Heart,
  Zap,
  Flame,
  Rocket,
  Dumbbell,
  Settings,
  Target,
  Sparkles,
  Stars,
  Trophy,
  Droplets,
  Target as TargetIcon,
  Code2,
  Video,
  Smartphone,
} from "lucide-react";
import { MOODS } from "@/lib/moods";
import { MoodCard } from "@/components/MoodCard";
import CrackedGlitch from "@/components/ui/CrackedGlitch";

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [backgroundElements, setBackgroundElements] = useState<
    Array<{ left: string; top: string }>
  >([]);

  // Generate random positions only on client side to avoid hydration mismatch
  useEffect(() => {
    const elements = [...Array(6)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setBackgroundElements(elements);
  }, []);

  const handleMoodClick = (moodId: string) => {
    setSelectedMood(moodId);
    setShowAnimation(true);

    // Store selected mood in the format expected by MoodProvider
    const moodPreferences = {
      selectedMood: moodId,
    };
    localStorage.setItem("mood-preferences", JSON.stringify(moodPreferences));

    // Also store the selected mood separately for the sign-in callback
    localStorage.setItem("selectedMood", moodId);

    // Show animation for 2 seconds before redirecting
    setTimeout(() => {
      window.location.href = "/auth/signin";
    }, 2000);
  };

  const getMoodAnimation = (moodId: string) => {
    switch (moodId) {
      case "chill":
        return {
          particles: [Waves, Wind, Heart],
          message: "Entering Chill Mode...",
          color: "from-blue-400 to-cyan-300",
          animation: "float",
        };
      case "rush":
        return {
          particles: [Zap, Flame, Rocket],
          message: "Rush Mode Activated!",
          color: "from-orange-400 to-red-400",
          animation: "bounce",
        };
      case "grind":
        return {
          particles: [Dumbbell, Settings, Target],
          message: "Grind Mode Engaged!",
          color: "from-purple-500 to-red-500",
          animation: "pulse",
        };
      default:
        return {
          particles: [Sparkles, Stars, Trophy],
          message: "Let's Go!",
          color: "from-blue-400 to-purple-400",
          animation: "bounce",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-800/20 dark:to-purple-800/20 blur-xl"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: element.left,
              top: element.top,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            From <span className="text-blue-600">Vibed</span> to{" "}
            <CrackedGlitch
              className="text-purple-600"
              size="large"
              intensity="medium"
            />
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The only programming learning platform that adapts to your mood.
            Whether you&apos;re chilling, rushing, or grinding - we&apos;ve got
            the perfect learning experience for you.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/signin"
                className="inline-block border-2 border-transparent/5 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Start Learning
              </Link>
            </motion.div>
            {/* <motion.button
              onClick={() => {
                // Scroll to mood selection section
                document.querySelector("#mood-selection")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button> */}
          </motion.div>
        </motion.div>

        {/* Mood Selection Preview */}
        <motion.div
          id="mood-selection"
          className="mb-16 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            Choose Your Learning Vibe
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.values(MOODS).map((mood, index) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="relative"
              >
                <MoodCard
                  mood={mood}
                  variant="homepage"
                  onClick={handleMoodClick}
                  showClickIndicator={true}
                />

                {/* Idle animations for each mood */}
                <motion.div
                  className="absolute -top-2 -right-2 text-blue-500"
                  animate={{
                    y:
                      mood.id === "chill"
                        ? [-5, 5, -5]
                        : mood.id === "rush"
                        ? [-10, 0, -10]
                        : [-3, 3, -3],
                    rotate:
                      mood.id === "chill"
                        ? [-5, 5, -5]
                        : mood.id === "rush"
                        ? [0, 10, 0]
                        : [0, 0, 0],
                  }}
                  transition={{
                    duration:
                      mood.id === "chill" ? 3 : mood.id === "rush" ? 1.5 : 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {mood.id === "chill" ? (
                    <Droplets className="w-6 h-6 text-blue-400" />
                  ) : mood.id === "rush" ? (
                    <Zap className="w-6 h-6 text-orange-400" />
                  ) : (
                    <Flame className="w-6 h-6 text-red-400" />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Animation Overlay */}
          <AnimatePresence>
            {showAnimation && selectedMood && (
              <motion.div
                className="fixed backdrop-blur-sm inset-0 z-50 flex items-center justify-center bg-black/80 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-center text-white"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  {/* Animated Background */}
                  <motion.div
                    className={`absolute  h-full w-full inset-0 rounded-full bg-gradient-to-r ${
                      getMoodAnimation(selectedMood).color
                    } opacity-20`}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 0.5] }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />

                  {/* Mood Icon */}
                  <motion.div
                    className="text-8xl mb-6 relative z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 150,
                    }}
                  >
                    {MOODS[selectedMood as keyof typeof MOODS]?.emoji}
                  </motion.div>

                  {/* Animated Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => {
                      const ParticleIcon =
                        getMoodAnimation(selectedMood).particles[i % 3];
                      return (
                        <motion.div
                          key={i}
                          className="absolute"
                          style={{
                            left: `${20 + i * 10}%`,
                            top: `${30 + (i % 3) * 20}%`,
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0,
                            x: 0,
                            y: 0,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            x: [0, i % 2 ? 50 : -50],
                            y: [0, i % 2 ? -50 : 50],
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.5 + i * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          <ParticleIcon className="w-8 h-8 text-white" />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Message */}
                  <motion.h2
                    className="text-4xl font-bold mb-4 relative z-10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    {getMoodAnimation(selectedMood).message}
                  </motion.h2>

                  {/* Loading indicator */}
                  <motion.div
                    className="flex justify-center space-x-2 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 bg-white rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                    ))}
                  </motion.div>

                  <motion.p
                    className="text-lg mt-4 opacity-75 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Preparing your personalized experience...
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why <span className="text-blue-600">Vibed</span> to{" "}
            <CrackedGlitch
              className="text-purple-600"
              size="small"
              intensity="low"
            />
            ?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TargetIcon,
                title: "Mood-Driven Learning",
                description:
                  "First platform to adapt content to your current mood and energy level",
              },
              {
                icon: Code2,
                title: "Live Code Editor",
                description:
                  "Practice JavaScript right in your browser with instant feedback",
              },
              {
                icon: Video,
                title: "Interactive Challenges",
                description:
                  "Hands-on coding challenges that test your skills in real-time",
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description:
                  "Learn anywhere, anytime with our mobile-optimized experience",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="flex justify-center mb-4"
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h3 className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
        >
          <motion.h2
            className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Transform Yourself From Vibe Coding To Cracked?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of developers who are learning JavaScript in a way
            that actually fits their lifestyle.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/signin"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/tutorials"
                className="inline-block border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Browse Tutorials
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Free tier includes 3 quizzes per month • No credit card required
          </motion.p>
          <motion.p
            className="text-xs text-gray-400 dark:text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Can&apos;t afford premium?{" "}
            <Link
              href="/free-access"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline"
            >
              Request free access
            </Link>{" "}
            - we believe everyone deserves to learn! 💝
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
