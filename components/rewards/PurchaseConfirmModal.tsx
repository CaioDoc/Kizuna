"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, ShoppingBag } from "lucide-react";
import { DatabaseReward } from "@/types";
import { usePointsStore } from "@/store/usePointsStore";
import { playCoinSound } from "@/lib/audio";
import confetti from "canvas-confetti";

export interface PurchaseConfirmModalProps {
  reward: DatabaseReward | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reward: DatabaseReward) => void;
}

export function PurchaseConfirmModal({
  reward,
  isOpen,
  onClose,
  onSuccess,
}: PurchaseConfirmModalProps) {
  const balance = usePointsStore((state) => state.balance);
  const spendPoints = usePointsStore((state) => state.spendPoints);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!reward) return null;

  const remainingBalance = balance - reward.cost_points;

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);

    // Play coin sound & fire confetti
    playCoinSound();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#8b5cf6", "#06b6d4"],
    });

    const success = await spendPoints(reward.cost_points, reward.id);
    setIsProcessing(false);

    if (success) {
      onSuccess(reward);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#f59e0b]/40 shadow-2xl space-y-6 text-center"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-[#f59e0b] animate-bounce" />
                <h2 className="text-xl font-extrabold text-white">Unlock Reward Perk</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e] hover:bg-[#2e2e42] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Item Brief */}
            <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
              <span className="text-[10px] font-mono text-[#a78bfa] uppercase font-bold">REWARD TITLE</span>
              <h3 className="text-lg font-black text-white">{reward.title}</h3>
              <p className="text-xs text-gray-400">{reward.description}</p>
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-2 text-xs font-mono text-gray-300 bg-[#0a0a0f] p-4 rounded-2xl border border-[#1f1f2e]">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Balance:</span>
                <span className="font-bold text-[#f59e0b]">{balance} Gold</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Perk Cost:</span>
                <span className="font-bold text-red-400">-{reward.cost_points} Gold</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1f1f2e] font-bold text-sm">
                <span className="text-gray-200">Remaining Balance:</span>
                <span className="text-[#06b6d4]">{remainingBalance} Gold</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-[#1f1f2e] text-gray-300 font-bold text-xs hover:bg-[#2e2e42] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing || remainingBalance < 0}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4] text-white text-xs font-black uppercase tracking-wider shadow-xl glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {isProcessing ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
