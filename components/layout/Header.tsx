"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Coins, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { usePointsStore } from "@/store/usePointsStore";
import { XpBar } from "@/components/ui/XpBar";
import { useLevelUp } from "@/hooks/useLevelUp";
import { LevelUpModal } from "@/components/ui/LevelUpModal";

export function Header() {
  const currentUser = useUserStore((state) => state.currentUser);
  const totalLevel = useUserStore((state) => state.totalLevel);
  const totalXp = useUserStore((state) => state.totalXp);
  const balance = usePointsStore((state) => state.balance);

  const { isLevelUpOpen, oldLevel, newLevel, triggerLevelUp, closeLevelUp } = useLevelUp();
  const prevLevelRef = useRef(totalLevel);

  useEffect(() => {
    if (totalLevel > prevLevelRef.current) {
      triggerLevelUp(prevLevelRef.current, totalLevel);
    }
    prevLevelRef.current = totalLevel;
  }, [totalLevel, triggerLevelUp]);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#1f1f2e] px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] p-[2px] glow-purple shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5cf6] animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-wider anime-gradient-text">
              KIZUNA
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/30">
              v1.0 RPG OS
            </span>
          </div>
        </Link>

        {/* Center: Animated XP Bar (desktop / tablet) */}
        <div className="flex-1 max-w-md hidden md:block">
          <XpBar level={totalLevel} currentXp={totalXp} />
        </div>

        {/* Right Stats & User Profile Link */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Level Badge Pill (Mobile only) */}
          <div className="md:hidden flex items-center gap-1 bg-[#8b5cf6]/15 border border-[#8b5cf6]/40 px-2 py-1 rounded-xl text-xs font-mono font-bold text-[#a78bfa]">
            <span>Lv.{totalLevel}</span>
          </div>

          {/* Gold Counter */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#12121a] border border-[#f59e0b]/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold text-[#f59e0b] shadow-sm">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f59e0b] animate-bounce" />
            <span className="font-mono text-xs sm:text-sm">{balance}</span>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#12121a] border border-[#ef4444]/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold text-red-400 shadow-sm">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500" />
            <span className="font-mono text-xs sm:text-sm">{currentUser?.current_streak || 0}d</span>
          </div>

          {/* User Avatar Link (Navigates to /profile) */}
          <Link
            href="/profile"
            className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#1f1f2e] group cursor-pointer"
            title="View Hero Profile"
          >
            <div className="relative">
              <Image
                src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=kizuna-hero"}
                alt={currentUser?.username || "Hero"}
                width={36}
                height={36}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border-2 border-[#8b5cf6] group-hover:border-[#06b6d4] transition-all glow-purple group-hover:scale-105"
                unoptimized
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] border-2 border-[#0a0a0f] rounded-full" />
            </div>

            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold text-gray-100 leading-tight group-hover:text-[#a78bfa] transition-colors">
                {currentUser?.username}
              </span>
              <span className="text-[11px] text-gray-400 font-mono truncate max-w-[120px]">
                Lv. {totalLevel} Hero
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Celebratory Level Up Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        oldLevel={oldLevel}
        newLevel={newLevel}
        onClose={closeLevelUp}
      />
    </header>
  );
}
