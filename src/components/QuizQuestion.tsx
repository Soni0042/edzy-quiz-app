"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import TimerDisplay from "./TimerDisplay";
import type { QuizQuestion as QuizQuestionType, AnswerState } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  answerState: AnswerState;
  shakeKey: number;
  elapsed: number;
  subject: string;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  answerState,
  shakeKey,
  elapsed,
  subject,
  onSelectOption,
  onNext,
}: QuizQuestionProps) {
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // ✅ Safe options handling (NO CRASH)
  const options = Array.isArray(question?.options) ? question.options : [];

  // Auto-focus Next button
  useEffect(() => {
    if (answerState === "correct" && nextBtnRef.current) {
      setTimeout(() => nextBtnRef.current?.focus(), 300);
    }
  }, [answerState]);

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedOptionId === optionId;
    const isCorrect = optionId === question?.correctOptionId;

    if (answerState === "unanswered") {
      return isSelected
        ? "bg-brand-600/20 border-brand-500 text-white ring-1 ring-brand-400/50"
        : "bg-surface-2 border-surface-4 text-slate-300 hover:bg-surface-3 hover:border-slate-500 hover:text-white";
    }

    if (answerState === "correct") {
      if (isCorrect) {
        return "bg-emerald-500/20 border-emerald-500 text-emerald-200";
      }
      return "bg-surface-2 border-surface-4/50 text-slate-500 opacity-50";
    }

    if (answerState === "incorrect") {
      if (isSelected) {
        return "bg-red-500/20 border-red-500 text-red-300";
      }
      return "bg-surface-2 border-surface-4 text-slate-300 hover:bg-surface-3 hover:border-slate-500 hover:text-white";
    }

    return "";
  };

  const isLocked = answerState === "correct";

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-mono text-slate-500 uppercase">
          {subject}
        </span>
        <TimerDisplay elapsed={elapsed} />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={questionNumber - 1} total={totalQuestions} />
        <p className="text-right text-xs text-slate-500 mt-1">
          Question <b>{questionNumber}</b> of {totalQuestions}
        </p>
      </div>

      {/* Question */}
      <div className="bg-surface-1 border rounded-xl p-5 mb-5">
        <p className="text-white">{question?.questionText || "Loading..."}</p>
      </div>

      {/* ✅ OPTIONS SAFE RENDER */}
      <div className="space-y-3 mb-6">
        {options.length > 0 ? (
          options.map((option, idx) => {
            const isSelected = selectedOptionId === option.optionId;
            const isCorrect = option.optionId === question?.correctOptionId;

            return (
              <button
                key={option.optionId}
                onClick={() =>
                  !isLocked && onSelectOption(option.optionId)
                }
                disabled={isLocked}
                className={cn(
                  "w-full p-4 rounded-lg border text-left",
                  getOptionStyle(option.optionId)
                )}
              >
                <span className="mr-2 font-bold">
                  {OPTION_LABELS[idx]}
                </span>
                {option.optionText || "Option"}
              </button>
            );
          })
        ) : (
          <p className="text-slate-400">Loading options...</p>
        )}
      </div>

      {/* Feedback */}
      {answerState !== "unanswered" && (
        <p
          className={
            answerState === "correct"
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {answerState === "correct"
            ? "Correct ✅"
            : "Incorrect ❌"}
        </p>
      )}

      {/* Next Button */}
      {answerState === "correct" && (
        <button
          ref={nextBtnRef}
          onClick={onNext}
          className="w-full py-3 bg-blue-600 text-white rounded-lg mt-4"
        >
          {questionNumber === totalQuestions
            ? "Finish Quiz"
            : "Next Question"}
        </button>
      )}
    </div>
  );
}