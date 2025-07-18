import { notFound } from "next/navigation";
import Link from "next/link";
import { readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import InteractiveCodeBlock from "@/components/InteractiveCodeBlock";

// Tutorial metadata interface
interface TutorialMetadata {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  topics: string[];
  quizQuestions: number;
  order: number;
}

// Mock tutorial mapping - in production this would come from database
const TUTORIAL_MAPPING = {
  "1": "01-variables-and-data-types",
  "2": "02-functions-and-scope",
  "3": "03-arrays-and-objects",
};

async function getTutorialContent(id: string) {
  const fileName = TUTORIAL_MAPPING[id as keyof typeof TUTORIAL_MAPPING];

  if (!fileName) {
    return null;
  }

  try {
    const filePath = join(
      process.cwd(),
      "src",
      "content",
      "tutorials",
      `${fileName}.mdx`
    );
    const fileContent = await readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      metadata: data as TutorialMetadata,
      content,
    };
  } catch (error) {
    console.error("Error loading tutorial:", error);
    return null;
  }
}

// Custom MDX components for enhanced tutorial experience
const components = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6 font-mono text-sm">
      {children}
    </pre>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="ml-4">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-6 text-gray-600 italic">
      {children}
    </blockquote>
  ),
  InteractiveCodeBlock,
};

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const tutorialData = await getTutorialContent(resolvedParams.id);

  if (!tutorialData) {
    notFound();
  }

  const { metadata, content } = tutorialData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/tutorials" className="text-2xl font-bold">
              <span className="text-blue-600">Vibed</span> to{" "}
              <span className="text-purple-600">Cracked</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/tutorials"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Tutorials
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tutorial Header */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex items-center gap-4 mb-6">
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  metadata.level === "beginner"
                    ? "bg-green-100 text-green-800"
                    : metadata.level === "intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {metadata.level}
              </span>
              <span className="text-sm text-gray-500">
                ⏱️ {metadata.estimatedTime}
              </span>
              <span className="text-sm text-gray-500">
                🧠 {metadata.quizQuestions} quiz questions
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {metadata.title}
            </h1>
            <p className="text-gray-600 mb-6">{metadata.description}</p>

            <div className="flex flex-wrap gap-2">
              {metadata.topics.map((topic, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <article className="prose prose-lg max-w-none">
              <MDXRemote source={content} components={components} />
            </article>
          </div>

          {/* Quiz CTA */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Test Your Knowledge? 🧠
            </h2>
            <p className="mb-6 opacity-90">
              Take the quiz to cement your understanding and unlock the next
              tutorial!
            </p>
            <Link
              href={`/quiz/${resolvedParams.id}`}
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Quiz
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Link
              href="/tutorials"
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← All Tutorials
            </Link>

            {parseInt(resolvedParams.id) < 3 && (
              <Link
                href={`/tutorials/${parseInt(resolvedParams.id) + 1}`}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Tutorial →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
