"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Swords, Flame, Brain, Crown, Coins, Gift, Sparkles, Lock, CheckCircle2 } from "lucide-react";
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
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1f1f2e] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4 flex-wrap gap-3">
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

        {/* Progress Counter Pill */}
        <div className="px-3 py-1 rounded-xl bg-[#12121a] border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-mono font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{unlockedCount} / {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* Scrollable List Container */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#8b5cf6]/40 scrollbar-track-[#0a0a0f]">
        {achievements.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 4 }}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.isUnlocked
                ? "bg-[#12121a] border-[#8b5cf6]/50"
                : "bg-[#0a0a0f]/60 border-[#1f1f2e] opacity-60"
            }`}
          >
            {/* Left: Icon & Info */}
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div
                className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${
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

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                  {item.isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#10b981] font-bold px-2 py-0.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Right: Date Badge */}
            {item.isUnlocked && item.unlockedAt && (
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-mono text-[#06b6d4] font-bold px-2.5 py-1 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 block w-fit sm:ml-auto">
                  Unlocked: {item.unlockedAt}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
