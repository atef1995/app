import Link from "next/link";
import { MOODS } from "@/lib/moods";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            From <span className="text-blue-600">Vibed</span> to{" "}
            <span className="text-purple-600">Cracked</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The only JavaScript learning platform that adapts to your mood.
            Whether you&apos;re chilling, rushing, or grinding - we&apos;ve got
            the perfect learning experience for you.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Learning
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Mood Selection Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Choose Your Learning Vibe
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.values(MOODS).map((mood) => (
              <div
                key={mood.id}
                className={`p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg cursor-pointer ${
                  mood.id === "chill"
                    ? "bg-blue-50"
                    : mood.id === "rush"
                    ? "bg-amber-50"
                    : "bg-gray-800 text-white"
                }`}
              >
                <div className="text-4xl mb-4">{mood.emoji}</div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    mood.id === "chill"
                      ? "text-blue-600"
                      : mood.id === "rush"
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {mood.name}
                </h3>
                <p
                  className={`mb-4 ${
                    mood.id === "grind" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {mood.description}
                </p>
                <div
                  className={`space-y-2 text-sm ${
                    mood.id === "grind" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div>📊 Difficulty: {mood.quizSettings.difficulty}</div>
                  <div>
                    ❓ Questions: {mood.quizSettings.questionsPerTutorial} per
                    tutorial
                  </div>
                  {mood.quizSettings.timeLimit && (
                    <div>
                      ⏱️ Time limit: {mood.quizSettings.timeLimit}s per question
                    </div>
                  )}
                  {!mood.quizSettings.timeLimit && (
                    <div>⏱️ No time pressure</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Vibed to Cracked?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-black text-xl font-semibold mb-2">
                Mood-Driven Learning
              </h3>
              <p className="text-gray-600">
                First platform to adapt content to your current mood and energy
                level
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-black text-xl font-semibold mb-2">
                Live Code Editor
              </h3>
              <p className="text-gray-600">
                Practice JavaScript right in your browser with instant feedback
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-black text-xl font-semibold mb-2">
                Video Explanations
              </h3>
              <p className="text-gray-600">
                Creator-made videos that explain concepts in a personal way
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-black text-xl font-semibold mb-2">
                Mobile First
              </h3>
              <p className="text-gray-600">
                Learn anywhere, anytime with our mobile-optimized experience
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Transform Your JavaScript Skills?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are learning JavaScript in a way
            that actually fits their lifestyle.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity">
              Get Started Free
            </button>
            <Link
              href="/tutorials"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Browse Tutorials
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Free tier includes 3 quizzes per month • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
