"use client";

import { cn } from "@/lib/utils";
import type { Subject, QuestionCount } from "@/types/quiz";

const SUBJECTS: { value: Subject; label: string; icon: string; color: string }[] =
  [
    {
      value: "Class 10 - English",
      label: "English",
      icon: "📖",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-400/60",
    },
    {
      value: "Class 10 - Mathematics",
      label: "Mathematics",
      icon: "📐",
      color:
        "from-violet-500/20 to-purple-500/20 border-violet-500/30 hover:border-violet-400/60",
    },
    {
      value: "Class 10 - Science",
      label: "Science",
      icon: "🔬",
      color:
        "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/60",
    },
    {
      value: "Class 10 - Social Science",
      label: "Social Science",
      icon: "🌍",
      color:
        "from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400/60",
    },
  ];

const QUESTION_COUNTS: QuestionCount[] = [5, 10, 15];

interface SubjectSelectorProps {
  selectedSubject: Subject | null;
  selectedCount: QuestionCount | null;
  onSubjectChange: (s: Subject) => void;
  onCountChange: (c: QuestionCount) => void;
  onStart: () => void;
  isLoading: boolean;
}

export default function SubjectSelector({
  selectedSubject,
  selectedCount,
  onSubjectChange,
  onCountChange,
  onStart,
  isLoading,
}: SubjectSelectorProps) {
  const canStart = selectedSubject !== null && selectedCount !== null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-mono font-semibold tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Ready to learn?
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3 leading-tight">
          Configure your Quiz
        </h1>
        <p className="text-slate-400 text-base font-body">
          Select a subject and number of questions to begin
        </p>
      </div>

      {/* Subject Grid */}
      <div className="mb-8">
        <label className="block text-xs font-mono font-semibold text-slate-400 tracking-widest uppercase mb-3">
          Choose Subject
        </label>
        <div className="grid grid-cols-2 gap-3">
          {SUBJECTS.map((s) => {
            const isSelected = selectedSubject === s.value;
            return (
              <button
                key={s.value}
                onClick={() => onSubjectChange(s.value)}
                className={cn(
                  "relative flex items-center gap-3 p-4 rounded-xl border bg-gradient-to-br text-left transition-all duration-200 group",
                  s.color,
                  isSelected
                    ? "ring-2 ring-brand-400 ring-offset-2 ring-offset-surface-1 scale-[1.02]"
                    : "hover:scale-[1.01]"
                )}
              >
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    Class 10
                  </p>
                  <p className="font-display font-semibold text-white text-sm">
                    {s.label}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center animate-bounce-check">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Count */}
      <div className="mb-8">
        <label className="block text-xs font-mono font-semibold text-slate-400 tracking-widest uppercase mb-3">
          Number of Questions
        </label>
        <div className="flex gap-3">
          {QUESTION_COUNTS.map((count) => {
            const isSelected = selectedCount === count;
            return (
              <button
                key={count}
                onClick={() => onCountChange(count)}
                className={cn(
                  "flex-1 py-3 rounded-xl border font-display font-bold text-lg transition-all duration-200",
                  isSelected
                    ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/25 scale-[1.05]"
                    : "bg-surface-2 border-surface-4 text-slate-400 hover:border-brand-500/50 hover:text-brand-300 hover:bg-surface-3"
                )}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={!canStart || isLoading}
        className={cn(
          "w-full py-4 rounded-xl font-display font-bold text-base tracking-wide transition-all duration-300 relative overflow-hidden",
          canStart && !isLoading
            ? "bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.01] active:scale-[0.99]"
            : "bg-surface-3 text-slate-600 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Fetching Questions…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Start Quiz
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
