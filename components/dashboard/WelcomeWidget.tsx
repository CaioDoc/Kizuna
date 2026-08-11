"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Coins, Flame, CheckSquare, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { usePointsStore } from "@/store/usePointsStore";
import { calculateCharacterClass } from "@/lib/character";
import { XpBar } from "@/components/ui/XpBar";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export interface WelcomeWidgetProps {
  todayTasksCount: number;
}

export function WelcomeWidget({ todayTasksCount }: WelcomeWidgetProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  const totalLevel = useUserStore((state) => state.totalLevel);
  const totalXp = useUserStore((state) => state.totalXp);
  const attributes = useUserStore((state) => state.attributes);
  const balance = usePointsStore((state) => state.balance);

  const greeting = getGreeting();
  const classInfo = calculateCharacterClass(attributes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 sm:p-8 rounded-3xl border border-[#8b5cf6]/40 shadow-2xl relative overflow-hidden space-y-6"
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#06b6d4]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar with Badge */}
        <div className="relative shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-[#8b5cf6] glow-purple shadow-2xl">
            <Image
              src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=kizuna-hero"}
              alt={currentUser?.username || "Hero Avatar"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white text-xs font-black shadow-lg font-mono">
            Lv. {totalLevel}
          </div>
        </div>

        {/* Greeting & Stats Pill Header */}
        <div className="flex-1 space-y-3 text-center md:text-left w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-xs font-mono text-[#a78bfa] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DASHBOARD COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {greeting}, <span className="anime-gradient-text">{currentUser?.username || "Hero"}</span>!
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span
                className="px-3 py-0.5 rounded-full text-xs font-mono font-black uppercase tracking-wider"
                style={{ backgroundColor: `${classInfo.color}20`, color: classInfo.color, border: `1px solid ${classInfo.color}40` }}
              >
                {classInfo.className} • {classInfo.subTitle}
              </span>
            </div>
          </div>

          <XpBar level={totalLevel} currentXp={totalXp} />
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1f1f2e]">
        <div className="p-3 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex flex-col items-center sm:flex-row sm:items-center gap-2">
          <div className="p-2 rounded-xl bg-[#06b6d4]/20 text-[#06b6d4]">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Today&apos;s Bounties</div>
            <div className="text-sm font-bold text-white font-mono">{todayTasksCount} Active</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex flex-col items-center sm:flex-row sm:items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
            <Flame className="w-4 h-4 fill-red-500 text-red-500" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Current Streak</div>
            <div className="text-sm font-bold text-white font-mono">{currentUser?.current_streak || 7} Days</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex flex-col items-center sm:flex-row sm:items-center gap-2">
          <div className="p-2 rounded-xl bg-[#f59e0b]/20 text-[#f59e0b]">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Gold Balance</div>
            <div className="text-sm font-bold text-[#f59e0b] font-mono">{balance} Gold</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
