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
    percentage >= 80 ? "Excellent!" : percentage >= 50 ? "Good Job!" : "Keep Practicing!";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1e2536"
            strokeWidth="10"
          />
          {/* Progress arc */}
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
          <span
            className="font-display font-bold text-2xl"
            style={{ color }}
          >
            {score}/{total}
          </span>
          <span className="font-mono text-xs text-slate-400">{percentage}%</span>
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
      <div className="flex justify-center mb-8 animate-pop-in" style={{ animationDelay: "200ms" }}>
        <ScoreRing score={score} total={totalQuestions} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Score",
            value: `${score}/${totalQuestions}`,
            sub: `${percentage}%`,
            color: "text-brand-400",
            bg: "bg-brand-500/10 border-brand-500/20",
          },
          {
            label: "Wrong Attempts",
            value: totalIncorrectAttempts,
            sub: totalIncorrectAttempts === 0 ? "Perfect!" : "total",
            color: totalIncorrectAttempts === 0 ? "text-emerald-400" : "text-red-400",
            bg:
              totalIncorrectAttempts === 0
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20",
          },
          {
            label: "Avg. Time",
            value: `${avgTime}s`,
            sub: "per question",
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl border p-4 text-center animate-count-up",
              stat.bg
            )}
            style={{ animationDelay: `${300 + i * 80}ms` }}
          >
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={cn("font-display font-bold text-xl", stat.color)}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 font-body">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Per-question breakdown */}
      <div
        className="bg-surface-1 border border-surface-4 rounded-2xl p-4 mb-6 animate-slide-up"
        style={{ animationDelay: "500ms" }}
      >
        <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Question Breakdown
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {questions.map((q, idx) => {
            const record = attemptRecords[idx];
            const incorrect = record?.incorrectAttempts ?? 0;
            const time = record?.timeElapsed ?? 0;
            return (
              <div
                key={q.questionId}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2/50"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                    incorrect === 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                  )}
                >
                  {incorrect === 0 ? (
                    <svg
                      className="w-3 h-3 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-red-400 font-mono text-xs font-bold">{incorrect}</span>
                  )}
                </div>
                <p className="flex-1 text-xs font-body text-slate-400 truncate">
                  {q.questionText}
                </p>
                <span className="text-xs font-mono text-slate-600 flex-shrink-0">
                  {time}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <button
          onClick={onReattempt}
          className="flex-1 py-3.5 rounded-xl border border-brand-500/40 bg-brand-600/10 text-brand-300 font-display font-bold text-sm tracking-wide hover:bg-brand-600/20 hover:border-brand-500/60 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reattempt
        </button>
        <button
          onClick={onNewQuiz}
          className="flex-1 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-display font-bold text-sm tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Quiz
        </button>
      </div>
    </div>
  );
}
