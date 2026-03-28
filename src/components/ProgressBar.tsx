"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  className,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
          Progress
        </span>
        <span className="text-xs font-mono font-bold text-brand-400">
          {current}/{total}
        </span>
      </div>
      <div className="relative h-2 bg-surface-3 rounded-full overflow-hidden">
        {/* Glow track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background:
              "linear-gradient(90deg, #4c6ef5 0%, #748ffc 50%, #91a7ff 100%)",
            boxShadow: "0 0 8px rgba(76, 110, 245, 0.6)",
          }}
        />
        {/* Shimmer */}
        <div
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
