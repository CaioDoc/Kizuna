"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, Swords, ShoppingBag, BookOpen, Sparkles } from "lucide-react";

export function QuickActionsWidget() {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          Quick Actions Launchpad
        </h3>
        <span className="text-[10px] font-mono text-gray-500">Shortcuts (Ctrl+K)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/habits"
          className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] hover:border-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-[#06b6d4] w-fit mx-auto group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-white">Add Habit</div>
          <span className="text-[9px] font-mono text-gray-500 block">Daily Routine</span>
        </Link>

        <Link
          href="/quests"
          className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6] w-fit mx-auto group-hover:scale-110 transition-transform">
            <Swords className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-white">Post Quest</div>
          <span className="text-[9px] font-mono text-gray-500 block">Bounty Board</span>
        </Link>

        <Link
          href="/rewards"
          className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] w-fit mx-auto group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-white">Buy Reward</div>
          <span className="text-[9px] font-mono text-gray-500 block">Rewards Vault</span>
        </Link>

        <Link
          href="/epics"
          className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] hover:border-[#10b981] hover:bg-[#10b981]/10 transition-all text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] w-fit mx-auto group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-white">Campaigns</div>
          <span className="text-[9px] font-mono text-gray-500 block">Master Epics</span>
        </Link>
      </div>
    </div>
  );
}
