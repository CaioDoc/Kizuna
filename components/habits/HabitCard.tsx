"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, GripVertical, Check, Sparkles, Edit, Trash2, BarChart2 } from "lucide-react";
import { DatabaseHabit } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { playCompletionSound } from "@/lib/audio";

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
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
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

      {/* Left: Drag Handle & Checkbox */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-gray-600 group-hover:text-gray-400 cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Large Custom Checkbox */}
        <button
          onClick={handleCheck}
          className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
            isCompletedToday
              ? "bg-[#10b981] border-[#10b981] text-white shadow-lg glow-purple"
              : "border-gray-600 bg-[#0a0a0f] hover:border-[#8b5cf6]"
          }`}
        >
          {isCompletedToday && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Habit Content */}
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}
            >
              {attributeMeta.label} (+{habit.attribute_xp} XP)
            </span>

            {/* Streak Counter (🔥) */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold">
              <Flame className="w-3 h-3 text-red-500 fill-red-500" />
              <span>{streakCount}d Streak</span>
            </div>
          </div>

          <h3 className={`font-bold text-sm sm:text-base truncate ${isCompletedToday ? "line-through text-gray-400" : "text-white"}`}>
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-xs text-gray-400 line-clamp-1">{habit.description}</p>
          )}
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        {onViewStats && (
          <button
            onClick={() => onViewStats(habit)}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#0a0a0f] hover:bg-[#1f1f2e] transition-colors"
            title="View Habit Statistics"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(habit)}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#0a0a0f] hover:bg-[#1f1f2e] transition-colors"
            title="Edit Habit"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-400 bg-[#0a0a0f] hover:bg-red-500/20 transition-colors"
            title="Delete Habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
