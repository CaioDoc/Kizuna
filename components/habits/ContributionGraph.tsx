"use client";

import React from "react";
import { format, subDays, isSameDay } from "date-fns";

export interface ContributionGraphProps {
  completedDates?: Date[];
}

export function ContributionGraph({ completedDates = [] }: ContributionGraphProps) {
  // Generate 35 days (5 weeks) of history
  const today = new Date();
  const days = Array.from({ length: 35 }).map((_, i) => subDays(today, 34 - i));

  const getIntensityClass = (date: Date) => {
    const completionsCount = completedDates.filter((d) => isSameDay(d, date)).length;
    if (completionsCount === 0) return "bg-[#12121a] border-[#1f1f2e]";
    if (completionsCount === 1) return "bg-[#10b981]/30 border-[#10b981]/50 shadow-[0_0_6px_#10b981]";
    if (completionsCount === 2) return "bg-[#10b981]/60 border-[#10b981]/70 shadow-[0_0_10px_#10b981]";
    return "bg-[#10b981] border-[#10b981] shadow-[0_0_14px_#10b981]";
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-[#1f1f2e] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-gray-300 uppercase">
          Consistency Matrix (Last 35 Days)
        </h3>
        <span className="text-[10px] font-mono text-gray-400">
          GitHub-Style Activity Graph
        </span>
      </div>

      {/* Grid of Squares */}
      <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            title={`${format(day, "MMM d, yyyy")}: Completed habits`}
            className={`h-8 rounded-lg border transition-all duration-200 flex items-center justify-center text-[10px] font-mono ${getIntensityClass(
              day
            )}`}
          >
            <span className="text-gray-400 text-[9px]">{format(day, "d")}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
        <span>Less Consistent</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-[#12121a] border border-[#1f1f2e]" />
          <div className="w-2.5 h-2.5 rounded bg-[#10b981]/30 border border-[#10b981]/50" />
          <div className="w-2.5 h-2.5 rounded bg-[#10b981]/60 border border-[#10b981]/70" />
          <div className="w-2.5 h-2.5 rounded bg-[#10b981] border border-[#10b981]" />
        </div>
        <span>High Streak</span>
      </div>
    </div>
  );
}
