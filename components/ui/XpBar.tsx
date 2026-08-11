"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { getXpProgress, calculateXpForLevel } from "@/lib/leveling";

export interface XpBarProps {
  level: number;
  currentXp: number;
  isGainingXp?: boolean;
  className?: string;
}

export function XpBar({ level, currentXp, isGainingXp = false, className = "" }: XpBarProps) {
  const nextLevelXp = calculateXpForLevel(level + 1);
  const progressPercentage = getXpProgress(currentXp, level);
  const isNearLevelUp = progressPercentage >= 80;

  return (
    <div className={`flex items-center gap-3 bg-[#12121a] px-4 py-2 rounded-xl border border-[#1f1f2e] ${className}`}>
      {/* Level Badge */}
      <div className="flex items-center gap-1 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] px-2.5 py-1 rounded-lg text-xs font-black text-white shadow-md">
        <span>LV</span>
        <span className="text-sm font-extrabold">{level}</span>
      </div>

      {/* Progress Bar Body */}
      <div className="flex-1 flex flex-col gap-1 min-w-[140px]">
        <div className="flex justify-between items-center text-[11px] font-medium text-gray-400">
          <span className="text-[#8b5cf6] font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#06b6d4]" /> EXP
          </span>
          <span className="font-mono text-gray-300">
            {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} ({progressPercentage}%)
          </span>
        </div>

        {/* Outer Bar Container */}
        <div
          className={`relative w-full h-2.5 bg-[#0a0a0f] rounded-full overflow-hidden p-[1px] border border-[#1f1f2e] transition-all ${
            isNearLevelUp ? "shadow-[0_0_12px_rgba(6,182,212,0.6)] border-[#06b6d4]/50" : ""
          }`}
        >
          {/* Fill Bar */}
          <motion.div
            className="h-full rounded-full xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Sparkle Micro-animation on XP Gain */}
          <AnimatePresence>
            {isGainingXp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-1 top-0 bottom-0 flex items-center"
              >
                <Sparkles className="w-3 h-3 text-[#f59e0b] animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
