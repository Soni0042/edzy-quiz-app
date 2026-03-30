"use client";

import { cn } from "@/lib/utils";
import type { QuizAttemptRecord, QuizQuestion, Subject } from "@/types/quiz";

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  totalIncorrectAttempts: number;
  attemptRecords: QuizAttemptRecord[];
  questions: QuizQuestion[];
  subject: Subject;
  onReattempt: () => void;
  onNewQuiz: () => void;
}

function ScoreRing({ score, total }: { score: number; total: number }) {
  const percentage = Math.round((score / total) * 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 80
      ? "#10b981"
      : percentage >= 50
      ? "#f59e0b"
      : "#ef4444";

  const glowColor =
    percentage >= 80
      ? "rgba(16,185,129,0.4)"
      : percentage >= 50
      ? "rgba(245,158,11,0.4)"
      : "rgba(239,68,68,0.4)";

  const label =
    percentage >= 80
      ? "Excellent!"
      : percentage >= 50
      ? "Good Job!"
      : "Keep Practicing!";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e2536" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-2xl" style={{ color }}>
            {score}/{total}
          </span>
          <span className="font-mono text-xs text-slate-400">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="font-display font-semibold text-base mt-2" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

export default function QuizSummary({
  score,
  totalQuestions,
  totalIncorrectAttempts,
  attemptRecords,
  questions,
  subject,
  onReattempt,
  onNewQuiz,
}: QuizSummaryProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const totalTime = attemptRecords.reduce((sum, r) => sum + r.timeElapsed, 0);
  const avgTime =
    attemptRecords.length > 0
      ? Math.round(totalTime / attemptRecords.length)
      : 0;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-mono font-semibold tracking-widest uppercase mb-4">
          Quiz Complete
        </div>
        <h1 className="font-display text-3xl font-bold text-white">
          Results Summary
        </h1>
        <p className="text-slate-400 text-sm font-body mt-1">{subject}</p>
      </div>

      {/* Score Ring */}
      <div className="flex justify-center mb-8">
        <ScoreRing score={score} total={totalQuestions} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center">
          <p className="text-xs text-slate-500">Score</p>
          <p className="text-lg text-brand-400">{score}/{totalQuestions}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Wrong</p>
          <p className="text-lg text-red-400">{totalIncorrectAttempts}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Avg Time</p>
          <p className="text-lg text-amber-400">{avgTime}s</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-6">
        {questions.map((q, idx) => {
          const record = attemptRecords[idx];
          const incorrect = record?.incorrectAttempts ?? 0;
          const time = record?.timeElapsed ?? 0;

          return (
            <div
              key={q.id} // ✅ FIXED HERE
              className="flex items-center gap-3 p-2 rounded bg-surface-2/50"
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  incorrect === 0 ? "bg-green-500/20" : "bg-red-500/20"
                )}
              >
                {incorrect === 0 ? "✓" : incorrect}
              </div>

              <p className="flex-1 text-sm text-slate-400 truncate">
                {q.questionText}
              </p>

              <span className="text-xs text-slate-500">{time}s</span>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onReattempt} className="flex-1 py-3 bg-gray-700 rounded">
          Reattempt
        </button>
        <button onClick={onNewQuiz} className="flex-1 py-3 bg-blue-600 rounded">
          New Quiz
        </button>
      </div>
    </div>
  );
}