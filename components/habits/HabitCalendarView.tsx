"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

export interface HabitCalendarViewProps {
  completedHistory?: { date: Date; habitTitles: string[] }[];
}

export function HabitCalendarView({ completedHistory = [] }: HabitCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDayLog = completedHistory.find((h) => isSameDay(h.date, selectedDate));

  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#1f1f2e] space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#06b6d4]" />
          Habit History Calendar ({format(selectedDate, "MMMM yyyy")})
        </h3>
      </div>

      {/* Calendar Month Days */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {["M", "T", "W", "T", "F", "S", "S"].map((dayName, i) => (
          <span key={i} className="font-mono text-gray-500 text-[10px]">
            {dayName}
          </span>
        ))}

        {daysInMonth.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayLog = completedHistory.find((h) => isSameDay(h.date, day));
          const hasCompletions = dayLog && dayLog.habitTitles.length > 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-xl flex flex-col items-center justify-between h-10 transition-all ${
                isSelected
                  ? "bg-[#8b5cf6] text-white shadow-lg glow-purple font-bold"
                  : "bg-[#0a0a0f] hover:bg-[#12121a] text-gray-300 border border-[#1f1f2e]"
              }`}
            >
              <span className="font-mono text-xs">{format(day, "d")}</span>
              {hasCompletions && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Inspector Panel for Selected Date */}
      <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-2">
        <div className="text-xs font-mono text-gray-400">
          Selected: <span className="text-white font-bold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
        </div>

        {selectedDayLog && selectedDayLog.habitTitles.length > 0 ? (
          <div className="space-y-1.5">
            {selectedDayLog.habitTitles.map((t, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No habit check-ins recorded on this day.</p>
        )}
      </div>
    </div>
  );
}
