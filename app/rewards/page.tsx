"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Plus, Sparkles, History, ShoppingBag } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import { RewardCard } from "@/components/rewards/RewardCard";
import { PurchaseConfirmModal } from "@/components/rewards/PurchaseConfirmModal";
import { RedeemedHistorySection, RedeemedItem } from "@/components/rewards/RedeemedHistorySection";
import { CreateRewardModal } from "@/components/rewards/CreateRewardModal";
import { DatabaseReward } from "@/types";

export default function RewardsPage() {
  const rewards = useEntitiesStore((state) => state.rewards);
  const balance = usePointsStore((state) => state.balance);

  const [activeTab, setActiveTab] = useState<"shop" | "history">("shop");
  const [selectedReward, setSelectedReward] = useState<DatabaseReward | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [redeemedHistory, setRedeemedHistory] = useState<RedeemedItem[]>([
    {
      id: "redeem-1",
      reward: {
        id: "r-mock-1",
        user_id: "demo-user-id",
        title: "1 Hour Uninterrupted Gaming Session",
        description: "Gaming time without productivity guilt.",
        cost_points: 300,
        image_url: null,
        is_active: true,
        created_at: "2026-08-10T12:00:00.000Z",
      },
      redeemedAt: new Date("2026-08-10T12:00:00.000Z"),
      isUsed: true,
    },
  ]);

  const handlePurchaseSuccess = (reward: DatabaseReward) => {
    const newRedeemedItem: RedeemedItem = {
      id: `redeem-${Math.floor(Math.random() * 1000000)}`,
      reward,
      redeemedAt: new Date(),
      isUsed: false,
    };
    setRedeemedHistory([newRedeemedItem, ...redeemedHistory]);
    setToastMessage(`Unlocked "${reward.title}"! Added to Redeemed Perks.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleUsed = (id: string) => {
    setRedeemedHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUsed: !item.isUsed } : item))
    );
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-[#12121a] border border-[#f59e0b] text-white shadow-2xl glow-gold text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f59e0b] animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181028] via-[#12121a] to-[#0d1b2a] border border-[#f59e0b]/30 p-6 sm:p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#8b5cf6]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-xs font-mono text-[#f59e0b]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REWARDS VAULT & SHOP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Bounty <span className="anime-gradient-text">Rewards Shop</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Exchange your hard-earned gold coins for real-world treats, digital cosmetics, and leisure breaks.
            </p>
          </div>

          {/* User Gold Balance Pill */}
          <div className="flex items-center gap-4 bg-[#0a0a0f] p-4 rounded-2xl border border-[#f59e0b]/40 shadow-xl shrink-0">
            <div className="p-3 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40">
              <Coins className="w-7 h-7 text-[#f59e0b] animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Available Gold</div>
              <div className="text-2xl font-black text-[#f59e0b] font-mono">{balance} Gold</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs & Shop Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#1f1f2e] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("shop")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "shop"
                ? "bg-[#f59e0b] text-black shadow-lg glow-gold font-bold"
                : "bg-[#12121a] text-gray-400 border border-[#1f1f2e] hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Rewards Vault
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "history"
                ? "bg-[#8b5cf6] text-white shadow-lg glow-purple font-bold"
                : "bg-[#12121a] text-gray-400 border border-[#1f1f2e] hover:text-white"
            }`}
          >
            <History className="w-4 h-4" /> Redeemed Perks ({redeemedHistory.length})
          </button>
        </div>

        {/* Add Reward Button */}
        {activeTab === "shop" && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4] text-white text-xs font-black uppercase tracking-wider shadow-lg glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Reward Perk
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === "shop" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userGold={balance}
              onSelectReward={(r) => setSelectedReward(r)}
            />
          ))}
        </div>
      ) : (
        <RedeemedHistorySection
          redeemedItems={redeemedHistory}
          onToggleUsed={handleToggleUsed}
        />
      )}

      {/* Modals */}
      <PurchaseConfirmModal
        reward={selectedReward}
        isOpen={!!selectedReward}
        onClose={() => setSelectedReward(null)}
        onSuccess={handlePurchaseSuccess}
      />

      <CreateRewardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
