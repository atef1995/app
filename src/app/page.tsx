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
  Check,
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
      window.location.href = "/dashboard";
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
            Master JavaScript and build 10 real portfolio projects in 12 weeks.
            Mood-adaptive learning that fits YOUR energy level - no burnout, just
            results.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="inline-block border-2 border-transparent/5 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Start Learning
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/free-course"
                className="inline-block border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
              >
                Get Free Course
              </Link>
            </motion.div>
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

        {/* Curriculum Roadmap Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Your Learning Path to Mastery
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A structured curriculum that takes you from complete beginner to job-ready developer
          </motion.p>

          <div className="max-w-5xl mx-auto">
            {/* Beginner Level */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                  Level 1: Beginner
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-green-300 to-transparent dark:from-green-700"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "JavaScript Fundamentals", duration: "4-6 hrs", topics: "Variables, Functions, Arrays" },
                  { title: "HTML Essentials", duration: "2-3 hrs", topics: "Structure, Forms, Semantic HTML" },
                  { title: "CSS Styling", duration: "3-4 hrs", topics: "Flexbox, Grid, Animations" },
                ].map((module, idx) => (
                  <motion.div
                    key={module.title}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{module.title}</h3>
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{module.topics}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{module.duration}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Intermediate Level */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                  Level 2: Intermediate
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700"></div>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { title: "DOM Manipulation", duration: "2-3 hrs", topics: "Events, Dynamic Pages" },
                  { title: "OOP JavaScript", duration: "3-4 hrs", topics: "Classes, Inheritance" },
                  { title: "Async Programming", duration: "2-3 hrs", topics: "Promises, Async/Await" },
                  { title: "Data Structures", duration: "4-6 hrs", topics: "Arrays, Objects, Maps" },
                ].map((module, idx) => (
                  <motion.div
                    key={module.title}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{module.title}</h3>
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{module.topics}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{module.duration}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Advanced Level */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold">
                  Level 3: Advanced
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-purple-300 to-transparent dark:from-purple-700"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Advanced JavaScript", duration: "5-8 hrs", topics: "Closures, Patterns, Performance" },
                  { title: "Node.js & APIs", duration: "6-8 hrs", topics: "Express, REST APIs, Databases" },
                  { title: "Git & GitHub", duration: "2-3 hrs", topics: "Version Control, Collaboration" },
                ].map((module, idx) => (
                  <motion.div
                    key={module.title}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{module.title}</h3>
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{module.topics}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{module.duration}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Total Duration */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
                <Trophy className="w-5 h-5" />
                Complete Curriculum: 40-60 hours to job-ready skills
              </div>
            </motion.div>
          </div>
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
                icon: Trophy,
                title: "Build 10+ Portfolio Projects",
                description:
                  "Create real-world projects that impress employers and land you interviews",
              },
              {
                icon: Target,
                title: "Job-Ready in 12 Weeks",
                description:
                  "Structured learning path from beginner to employable developer",
              },
              {
                icon: Zap,
                title: "Learn at Your Own Pace",
                description:
                  "Mood-adaptive content adjusts to your energy level - no burnout",
              },
              {
                icon: Code2,
                title: "Master Modern JavaScript",
                description:
                  "From basics to advanced - ES6+, async/await, APIs, and Node.js",
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

        {/* Free Course Promotion */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                🎁 Limited Time Offer
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Not Ready to Commit? Start with Our Free Course!
              </motion.h2>
              <motion.p
                className="text-xl mb-6 text-orange-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Get our 5-day JavaScript crash course delivered to your inbox — absolutely free.
                No credit card required.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  href="/free-course"
                  className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Free Course →
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us Over Alternatives?
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            See how we stack up against other learning options
          </motion.p>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <motion.table
              className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">YouTube/Free</th>
                  <th className="px-6 py-4 text-center font-semibold">Bootcamps</th>
                  <th className="px-6 py-4 text-center font-semibold bg-white/20">Vibed to Cracked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: "Structured Curriculum", youtube: false, bootcamp: true, us: true },
                  { feature: "Mood-Adaptive Learning", youtube: false, bootcamp: false, us: true },
                  { feature: "Learn at Your Pace", youtube: true, bootcamp: false, us: true },
                  { feature: "Portfolio Projects", youtube: false, bootcamp: true, us: true },
                  { feature: "Interactive Code Editor", youtube: false, bootcamp: true, us: true },
                  { feature: "Progress Tracking", youtube: false, bootcamp: true, us: true },
                  { feature: "Cost", youtube: "Free", bootcamp: "$15k-20k", us: "$9.98/mo" },
                  { feature: "Time Commitment", youtube: "Self-paced", bootcamp: "3-6 months full-time", us: "12 weeks part-time" },
                ].map((row, idx) => (
                  <motion.tr
                    key={row.feature}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.youtube === 'boolean' ? (
                        row.youtube ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{row.youtube}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.bootcamp === 'boolean' ? (
                        row.bootcamp ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{row.bootcamp}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50 dark:bg-blue-900/20">
                      {typeof row.us === 'boolean' ? (
                        row.us ? (
                          <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{row.us}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 Early Adopter Pricing Active
            </div>
          </motion.div>
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
            Master JavaScript with mood-adaptive learning that actually works
            for real life.
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
                href="/dashboard"
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
            Try 5 tutorials free without signup • No credit card required
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure payment via Stripe</span>
            </div>
          </motion.div>
          <motion.p
            className="text-xs text-gray-400 dark:text-gray-500 mt-4"
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
