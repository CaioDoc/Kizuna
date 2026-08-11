"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Swords, Flame, Brain, Crown, Coins, Gift, Sparkles, Lock } from "lucide-react";
import { AchievementItem } from "@/lib/character";

export interface AchievementsGridProps {
  achievements: AchievementItem[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Swords: <Swords className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Coins: <Coins className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1f1f2e] space-y-6">
      <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b]">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Hero Achievements & Badges</h2>
            <p className="text-xs text-gray-400 font-mono">
              Unlock legendary trophies by mastering habits and completing epics.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              item.isUnlocked
                ? "bg-[#12121a] border-[#8b5cf6]/40 glow-purple shadow-lg"
                : "bg-[#0a0a0f]/60 border-[#1f1f2e] opacity-60 grayscale"
            }`}
          >
            <div
              className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${
                item.isUnlocked
                  ? "bg-[#8b5cf6]/20 border-[#8b5cf6]/50 text-[#f59e0b]"
                  : "bg-[#1f1f2e] border-gray-700 text-gray-500"
              }`}
            >
              {item.isUnlocked ? (
                ICON_MAP[item.icon] || <Trophy className="w-5 h-5 text-[#f59e0b]" />
              ) : (
                <Lock className="w-5 h-5 text-gray-500" />
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-white truncate">{item.title}</h4>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight line-clamp-2">
                {item.description}
              </p>
              {item.isUnlocked && item.unlockedAt && (
                <span className="inline-block text-[9px] font-mono text-[#06b6d4]">
                  Unlocked: {item.unlockedAt}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
