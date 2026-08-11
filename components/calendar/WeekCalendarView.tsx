"use client";

import React from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Swords, CheckSquare } from "lucide-react";

export interface WeekCalendarViewProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

export function WeekCalendarView({
  currentDate,
  selectedDate,
  onSelectDate,
}: WeekCalendarViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-[#1f1f2e] space-y-4 overflow-x-auto">
      {/* 7 Day Columns Header */}
      <div className="grid grid-cols-7 gap-2 text-center min-w-[600px]">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`p-3 rounded-2xl border transition-all text-center space-y-1 ${
                isSelected
                  ? "bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg glow-purple"
                  : "bg-[#0a0a0f] text-gray-300 border-[#1f1f2e] hover:border-gray-700"
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase text-gray-400">
                {format(day, "EEE")}
              </div>
              <div className="text-base font-black font-mono">{format(day, "d")}</div>
            </button>
          );
        })}
      </div>

      {/* Hourly Timeline Rows */}
      <div className="space-y-3 min-w-[600px] pt-2">
        {HOURS.map((hourStr, idx) => (
          <div key={hourStr} className="grid grid-cols-7 gap-2 items-start">
            <div className="text-[10px] font-mono text-gray-500 text-right pr-2 pt-1">
              {hourStr}
            </div>

            {/* Event slot cells across days */}
            {weekDays.map((day, dIdx) => (
              <div
                key={dIdx}
                className="h-16 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] p-2 hover:border-[#8b5cf6]/40 transition-colors flex flex-col justify-between"
              >
                {/* Mock Event Cards on specific slots */}
                {idx === 1 && dIdx === 1 && (
                  <div className="p-1.5 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] text-[10px] font-mono font-bold truncate">
                    <Swords className="w-3 h-3 inline mr-1" /> Next.js Quest
                  </div>
                )}

                {idx === 3 && dIdx === 3 && (
                  <div className="p-1.5 rounded-lg bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-[10px] font-mono font-bold truncate">
                    <CheckSquare className="w-3 h-3 inline mr-1" /> 30-min Gym
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
