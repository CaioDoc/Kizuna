"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Flame, Coins, Sparkles, QrCode } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { usePointsStore } from "@/store/usePointsStore";
import { XpBar } from "@/components/ui/XpBar";
import { useLevelUp } from "@/hooks/useLevelUp";
import { LevelUpModal } from "@/components/ui/LevelUpModal";
import { MobileQrModal } from "@/components/ui/MobileQrModal";

export function Header() {
  const currentUser = useUserStore((state) => state.currentUser);
  const totalLevel = useUserStore((state) => state.totalLevel);
  const totalXp = useUserStore((state) => state.totalXp);
  const balance = usePointsStore((state) => state.balance);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const { isLevelUpOpen, oldLevel, newLevel, triggerLevelUp, closeLevelUp } = useLevelUp();
  const prevLevelRef = useRef(totalLevel);

  useEffect(() => {
    if (totalLevel > prevLevelRef.current) {
      triggerLevelUp(prevLevelRef.current, totalLevel);
    }
    prevLevelRef.current = totalLevel;
  }, [totalLevel, triggerLevelUp]);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#1f1f2e] px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] p-[2px] glow-purple">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#8b5cf6] animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider anime-gradient-text">
              KIZUNA
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/30">
              v1.0 RPG OS
            </span>
          </div>
        </div>

        {/* Center: Animated XP Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <XpBar level={totalLevel} currentXp={totalXp} />
        </div>

        {/* Right Stats & Mobile QR Button */}
        <div className="flex items-center gap-3">
          {/* Mobile QR Button */}
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-1.5 bg-[#8b5cf6]/15 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/40 px-3 py-1.5 rounded-xl text-xs font-bold text-[#a78bfa] transition-all"
            title="Scan QR Code to access on Mobile Smartphone"
          >
            <QrCode className="w-4 h-4 text-[#8b5cf6]" />
            <span className="font-mono text-xs hidden sm:inline">Mobile QR</span>
          </button>

          {/* Gold Counter */}
          <div className="flex items-center gap-1.5 bg-[#12121a] border border-[#f59e0b]/30 px-3 py-1.5 rounded-xl text-xs font-bold text-[#f59e0b] shadow-sm">
            <Coins className="w-4 h-4 text-[#f59e0b] animate-bounce" />
            <span className="font-mono text-sm">{balance}</span>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 bg-[#12121a] border border-[#ef4444]/30 px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 shadow-sm">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="font-mono text-sm">{currentUser?.current_streak || 0}d</span>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#1f1f2e]">
            <div className="relative group cursor-pointer">
              <Image
                src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=kizuna-hero"}
                alt={currentUser?.username || "Hero"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover border-2 border-[#8b5cf6] group-hover:border-[#06b6d4] transition-colors glow-purple"
                unoptimized
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#0a0a0f] rounded-full" />
            </div>

            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold text-gray-100 leading-tight">
                {currentUser?.username}
              </span>
              <span className="text-[11px] text-gray-400 font-mono truncate max-w-[120px]">
                Lv. {totalLevel} Hero
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile QR Modal */}
      <MobileQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />

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
