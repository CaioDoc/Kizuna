"use client";

import React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

export type CalendarViewMode = "month" | "week" | "day";

export interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onNewEvent,
}: CalendarHeaderProps) {
  return (
    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-[#1f1f2e] space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Month / Date Label */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#06b6d4] uppercase font-bold">
                KIZUNA SCHEDULER
              </span>
              <span className="text-[9px] font-mono text-gray-500 hidden sm:inline">
                (Press &apos;T&apos; for Today, &apos;N&apos; for New)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {format(currentDate, "MMMM yyyy")}
            </h1>
          </div>
        </div>

        {/* Center: Controls & View Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1 bg-[#0a0a0f] p-1 rounded-2xl border border-[#1f1f2e]">
            <button
              onClick={onPrev}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#12121a] transition-colors"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onToday}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-gray-300 hover:text-white hover:bg-[#12121a] transition-colors"
              title="Jump to Today (Key 'T')"
            >
              Today
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#12121a] transition-colors"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0a0a0f] p-1 rounded-2xl border border-[#1f1f2e]">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  viewMode === mode
                    ? "bg-[#8b5cf6] text-white shadow-md glow-purple"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* New Event Button */}
          <button
            onClick={onNewEvent}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f59e0b] text-white text-xs font-black uppercase tracking-wider shadow-lg glow-purple hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
