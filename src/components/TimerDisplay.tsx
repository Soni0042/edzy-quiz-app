"use client";

import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  elapsed: number;
  className?: string;
}

export default function TimerDisplay({ elapsed, className }: TimerDisplayProps) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isWarning = elapsed >= 30 && elapsed < 60;
  const isDanger = elapsed >= 60;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-wider transition-colors duration-300",
        isDanger
          ? "bg-red-500/10 border-red-500/30 text-red-400"
          : isWarning
          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
          : "bg-surface-3 border-surface-4 text-slate-300",
        className
      )}
    >
      {/* Clock icon */}
      <svg
        className={cn(
          "w-3.5 h-3.5",
          isDanger
            ? "text-red-400 animate-pulse"
            : isWarning
            ? "text-amber-400"
            : "text-brand-400"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
