"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Coins, ShoppingBag, Lock } from "lucide-react";
import { DatabaseReward } from "@/types";

export interface RewardCardProps {
  reward: DatabaseReward;
  userGold: number;
  onSelectReward: (reward: DatabaseReward) => void;
}

export type RarityType = "Common" | "Rare" | "Epic" | "Legendary";

export function getRewardRarity(cost: number): RarityType {
  if (cost < 500) return "Common";
  if (cost < 2000) return "Rare";
  if (cost < 5000) return "Epic";
  return "Legendary";
}

export const RARITY_CONFIG: Record<RarityType, { label: string; badgeClass: string; glowClass: string; textColor: string }> = {
  Common: {
    label: "COMMON",
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    glowClass: "border-[#1f1f2e] hover:border-slate-500/50",
    textColor: "text-slate-300",
  },
  Rare: {
    label: "RARE",
    badgeClass: "bg-[#06b6d4]/20 text-[#06b6d4] border-[#06b6d4]/40",
    glowClass: "border-[#06b6d4]/40 hover:border-[#06b6d4] glow-cyan",
    textColor: "text-[#06b6d4]",
  },
  Epic: {
    label: "EPIC",
    badgeClass: "bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/40",
    glowClass: "border-[#8b5cf6]/40 hover:border-[#8b5cf6] glow-purple",
    textColor: "text-[#8b5cf6]",
  },
  Legendary: {
    label: "LEGENDARY",
    badgeClass: "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40",
    glowClass: "border-[#f59e0b]/50 hover:border-[#f59e0b] glow-gold",
    textColor: "text-[#f59e0b]",
  },
};

const DEFAULT_SHOP_BANNER = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80";

export function RewardCard({ reward, userGold, onSelectReward }: RewardCardProps) {
  const rarity = getRewardRarity(reward.cost_points);
  const rarityMeta = RARITY_CONFIG[rarity];
  const canAfford = userGold >= reward.cost_points;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative rounded-3xl bg-[#12121a] border ${rarityMeta.glowClass} shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        {/* Banner Cover Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#0a0a0f]">
          <Image
            src={reward.image_url || DEFAULT_SHOP_BANNER}
            alt={reward.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/40 to-transparent" />

          {/* Rarity Indicator Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider border backdrop-blur-md ${rarityMeta.badgeClass}`}
            >
              {rarityMeta.label} PERK
            </span>
          </div>

          {/* Price Tag */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0f]/80 backdrop-blur-md font-mono font-black text-sm text-[#f59e0b] border border-[#f59e0b]/40 shadow-md">
            <Coins className="w-4 h-4 text-[#f59e0b] animate-bounce" />
            <span>{reward.cost_points} Gold</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-2">
          <h3 className="text-xl font-extrabold text-white group-hover:text-[#a78bfa] transition-colors leading-tight">
            {reward.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
            {reward.description || "No description provided for this reward perk."}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onSelectReward(reward)}
          disabled={!canAfford}
          className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            canAfford
              ? "bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4] text-white shadow-xl hover:brightness-110 glow-purple"
              : "bg-[#1f1f2e]/60 text-gray-500 border border-[#1f1f2e] cursor-not-allowed"
          }`}
        >
          {canAfford ? (
            <>
              <ShoppingBag className="w-4 h-4" /> Unlock Perk ({reward.cost_points} Gold)
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Need {reward.cost_points - userGold} More Gold
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
