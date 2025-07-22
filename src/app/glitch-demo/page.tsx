"use client";

import CrackedGlitch from "@/components/ui/CrackedGlitch";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GlitchDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          CrackedGlitch Component Demo
        </motion.h1>

        <div className="grid gap-12">
          {/* Size Variations */}
          <motion.section
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Size Variations
            </h2>
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-gray-300 mb-4">Large Size</p>
                <div className="text-6xl font-bold">
                  <CrackedGlitch size="large" intensity="medium" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">Small Size</p>
                <div className="text-3xl font-bold">
                  <CrackedGlitch size="small" intensity="medium" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Intensity Variations */}
          <motion.section
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Intensity Variations
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-gray-300 mb-4">Low Intensity</p>
                <div className="text-4xl font-bold">
                  <CrackedGlitch size="large" intensity="low" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">Medium Intensity</p>
                <div className="text-4xl font-bold">
                  <CrackedGlitch size="large" intensity="medium" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">High Intensity</p>
                <div className="text-4xl font-bold">
                  <CrackedGlitch size="large" intensity="high" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Color Variations */}
          <motion.section
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Color Variations
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-gray-300 mb-4">Purple (Default)</p>
                <div className="text-4xl font-bold">
                  <CrackedGlitch
                    className="text-purple-600"
                    size="large"
                    intensity="medium"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">Blue</p>
                <div className="text-4xl font-bold">
                  <CrackedGlitch
                    className="text-blue-500"
                    size="large"
                    intensity="medium"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">Red</p>
                <div className="text-4xl font-bold">
                  <CrackedGlitch
                    className="text-red-500"
                    size="large"
                    intensity="medium"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Custom Text */}
          <motion.section
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Custom Text
            </h2>
            <div className="space-y-8 text-center">
              <div className="text-5xl font-bold">
                <CrackedGlitch
                  text="GLITCHED"
                  className="text-cyan-400"
                  size="large"
                  intensity="high"
                />
              </div>
              <div className="text-3xl font-bold">
                <CrackedGlitch
                  text="DIGITAL"
                  className="text-green-400"
                  size="small"
                  intensity="medium"
                />
              </div>
              <div className="text-4xl font-bold">
                <CrackedGlitch
                  text="CORRUPTED"
                  className="text-yellow-400"
                  size="large"
                  intensity="low"
                />
              </div>
            </div>
          </motion.section>

          {/* Usage Example */}
          <motion.section
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Usage Example
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`<CrackedGlitch 
  text="Your Text" 
  className="text-purple-600" 
  size="large" 
  intensity="medium" 
/>`}</pre>
            </div>
            <div className="mt-4 text-gray-300 text-sm space-y-2">
              <p>
                <strong>Props:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <code>text</code>: Custom text (default: &quot;Cracked&quot;)
                </li>
                <li>
                  <code>size</code>: &quot;small&quot; | &quot;large&quot;
                  (default: &quot;large&quot;)
                </li>
                <li>
                  <code>intensity</code>: &quot;low&quot; | &quot;medium&quot; |
                  &quot;high&quot; (default: &quot;medium&quot;)
                </li>
                <li>
                  <code>className</code>: CSS classes for styling
                </li>
                <li>
                  <code>style</code>: Inline styles
                </li>
              </ul>
            </div>
          </motion.section>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Back to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
