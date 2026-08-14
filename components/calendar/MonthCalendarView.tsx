"use client";

import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export interface MonthCalendarViewProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MonthCalendarView({
  currentDate,
  selectedDate,
  onSelectDate,
}: MonthCalendarViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-[#1f1f2e] space-y-4 overflow-x-auto">
      <div className="min-w-[540px]">
        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-gray-400 border-b border-[#1f1f2e] pb-3">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {daysInMonth.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const dayNum = format(day, "d");

            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelectDate(day)}
                className={`p-2.5 rounded-2xl h-20 sm:h-28 flex flex-col justify-between items-start transition-all border ${
                  isSelected
                    ? "bg-[#8b5cf6]/20 border-[#8b5cf6] shadow-lg glow-purple"
                    : "bg-[#0a0a0f] border-[#1f1f2e] hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs sm:text-sm font-bold ${
                      isSelected ? "text-[#a78bfa]" : "text-gray-300"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Day Mini Stats Pill */}
                  <span className="text-[10px] font-mono text-[#10b981] font-bold">
                    +120 XP
                  </span>
                </div>

                {/* Color-Coded Entity Indicator Dots */}
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  <div className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6]" title="Epic" />
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]" title="Quest" />
                  <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" title="Task" />
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" title="Habit" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
