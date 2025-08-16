"use client";

import { Question } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | undefined;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}: QuizQuestionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Question {questionNumber}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 select-none leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-3 select-none">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all select-none ${
              selectedAnswer === index
                ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200"
            }`}
          >
            <span className="font-semibold mr-3 select-none">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="select-none">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}