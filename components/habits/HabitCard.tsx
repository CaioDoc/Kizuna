"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, GripVertical, Check, Sparkles, Edit, Trash2, BarChart2, CalendarDays } from "lucide-react";
import { DatabaseHabit } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { playCompletionSound } from "@/lib/audio";

const WEEKDAYS_MINI = [
  { id: "mon", label: "S" },
  { id: "tue", label: "T" },
  { id: "wed", label: "Q" },
  { id: "thu", label: "Q" },
  { id: "fri", label: "S" },
  { id: "sat", label: "S" },
  { id: "sun", label: "D" },
];

const ALL_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export interface HabitCardProps {
  habit: DatabaseHabit;
  onToggle: (habit: DatabaseHabit) => void;
  onEdit?: (habit: DatabaseHabit) => void;
  onDelete?: (id: string) => void;
  onViewStats?: (habit: DatabaseHabit) => void;
  isCompletedToday: boolean;
  streakCount: number;
}

export function HabitCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
  onViewStats,
  isCompletedToday,
  streakCount,
}: HabitCardProps) {
  const [showFloatingXp, setShowFloatingXp] = useState(false);
  const attributeMeta = ATTRIBUTES_CONFIG[habit.attribute_type || "str"];

  const activeDays = habit.repeat_days || ALL_DAYS;
  const isEveryday = activeDays.length === 7;

  const handleCheck = () => {
    if (!isCompletedToday) {
      playCompletionSound();
      setShowFloatingXp(true);
      setTimeout(() => setShowFloatingXp(false), 1200);
    }
    onToggle(habit);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.008 }}
      className={`group relative p-3.5 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
        isCompletedToday
          ? "bg-[#10b981]/10 border-[#10b981]/40 text-gray-300"
          : "glass-card border-[#1f1f2e] hover:border-[#8b5cf6]/40"
      }`}
    >
      {/* Floating +XP Animation */}
      <AnimatePresence>
        {showFloatingXp && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1.2 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute right-12 top-2 pointer-events-none z-30 font-black font-mono text-sm text-[#10b981] flex items-center gap-1 bg-black/80 px-2 py-1 rounded-lg border border-[#10b981]/50 shadow-lg glow-purple"
          >
            <Sparkles className="w-4 h-4 text-[#f59e0b] animate-spin" />
            <span>+{habit.attribute_xp} {attributeMeta.label} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Row: Checkbox, Title & Badges */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <div className="hidden sm:block text-gray-600 group-hover:text-gray-400 cursor-grab active:cursor-grabbing p-1 shrink-0">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Large Touch Checkbox */}
        <button
          onClick={handleCheck}
          className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
            isCompletedToday
              ? "bg-[#10b981] border-[#10b981] text-white shadow-lg glow-purple"
              : "border-gray-600 bg-[#0a0a0f] hover:border-[#8b5cf6]"
          }`}
        >
          {isCompletedToday && <Check className="w-5 h-5 stroke-[3]" />}
        </button>

        {/* Habit Content */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}
            >
              {attributeMeta.label} (+{habit.attribute_xp} XP)
            </span>

            {/* Streak Counter (🔥) */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>{streakCount}d Streak</span>
            </div>

            {/* Schedule Badge */}
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {isEveryday ? "Todos os dias" : `${activeDays.length}x / sem`}
            </span>
          </div>

          <h3 className={`font-bold text-base sm:text-lg leading-snug break-words ${isCompletedToday ? "line-through text-gray-400" : "text-white"}`}>
            {habit.title}
          </h3>

          {/* Weekday Active Indicators Bar */}
          <div className="flex items-center gap-1 pt-0.5 flex-wrap">
            {WEEKDAYS_MINI.map((day) => {
              const isActive = activeDays.includes(day.id);
              return (
                <span
                  key={day.id}
                  className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center border transition-all ${
                    isActive
                      ? "bg-[#8b5cf6]/30 border-[#8b5cf6] text-[#a78bfa]"
                      : "bg-[#0a0a0f] border-[#1f1f2e] text-gray-600"
                  }`}
                  title={day.label}
                >
                  {day.label}
                </span>
              );
            })}
          </div>

          {habit.description && (
            <p className="text-xs text-gray-400 leading-normal">{habit.description}</p>
          )}
        </div>
      </div>

      {/* Right / Bottom: Action Controls */}
      <div className="flex items-center justify-end gap-1.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#1f1f2e]">
        {onViewStats && (
          <button
            onClick={() => onViewStats(habit)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white bg-[#0a0a0f] hover:bg-[#1f1f2e] transition-colors border border-[#1f1f2e]"
            title="View Habit Statistics"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(habit)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white bg-[#0a0a0f] hover:bg-[#1f1f2e] transition-colors border border-[#1f1f2e]"
            title="Edit Habit"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 bg-[#0a0a0f] hover:bg-red-500/20 transition-colors border border-[#1f1f2e]"
            title="Delete Habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
