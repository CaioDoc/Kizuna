"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Trophy, BarChart2, CheckCircle2, Sparkles, Dumbbell, Zap, Brain, BookOpen, Shield } from "lucide-react";
import { DatabaseHabit } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";

export interface HabitStatsModalProps {
  habit: DatabaseHabit | null;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

export function HabitStatsModal({ habit, isOpen, onClose }: HabitStatsModalProps) {
  if (!habit) return null;

  const attributeMeta = ATTRIBUTES_CONFIG[habit.attribute_type || "str"];
  const currentStreak = 12;
  const bestStreak = 24;
  const completionRate = 88;
  const totalXpEarned = 1450;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border-2 ${attributeMeta.borderColor} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}>
                  {ICON_MAP[attributeMeta.iconName] || <BarChart2 className="w-5 h-5" />}
                </div>
                <div>
                  <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}>
                    {attributeMeta.fullName}
                  </span>
                  <h2 className="text-lg font-extrabold text-white mt-0.5">{habit.title}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e] hover:bg-[#2e2e42] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 uppercase">
                  <Flame className="w-3.5 h-3.5 text-red-500" /> Current Streak
                </div>
                <div className="text-xl font-black text-red-400 font-mono">{currentStreak} Days</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 uppercase">
                  <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" /> Best Streak
                </div>
                <div className="text-xl font-black text-[#f59e0b] font-mono">{bestStreak} Days</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Completion Rate
                </div>
                <div className="text-xl font-black text-[#10b981] font-mono">{completionRate}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" /> Total XP Yield
                </div>
                <div className="text-xl font-black text-[#8b5cf6] font-mono">+{totalXpEarned} XP</div>
              </div>
            </div>

            {/* Habit Schedule Info */}
            <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] text-xs space-y-1">
              <span className="text-gray-400 font-mono uppercase text-[10px]">Routine Frequency</span>
              <div className="font-bold text-gray-200 uppercase">{habit.frequency} Routine</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
