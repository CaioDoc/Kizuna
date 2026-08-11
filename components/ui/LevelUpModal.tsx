"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Shield, ArrowUpRight, X } from "lucide-react";
import confetti from "canvas-confetti";

export interface LevelUpModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, oldLevel, newLevel, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti celebration explosion
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-[#181028] via-[#12121a] to-[#0a0a0f] border-2 border-[#8b5cf6] shadow-[0_0_50px_rgba(139,92,246,0.5)] text-center space-y-6 overflow-hidden"
          >
            {/* Background Glow Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#8b5cf6]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-[#06b6d4]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e]/50 hover:bg-[#1f1f2e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Header */}
            <div className="flex justify-center">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#06b6d4] p-[2px] shadow-lg glow-purple"
              >
                <div className="w-full h-full bg-[#0a0a0f] rounded-[14px] flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-[#f59e0b] animate-bounce" />
                </div>
              </motion.div>
            </div>

            {/* Title & Level Info */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-mono text-[#a78bfa] font-bold">
                CONGRATULATIONS HERO
              </span>
              <h2 className="text-3xl font-black tracking-tight anime-gradient-text">
                LEVEL UP!
              </h2>
              <div className="flex items-center justify-center gap-3 text-lg font-bold text-gray-200 mt-2">
                <span className="text-gray-400 font-mono">Lv. {oldLevel}</span>
                <ArrowUpRight className="w-5 h-5 text-[#10b981] animate-pulse" />
                <span className="text-2xl font-black text-[#06b6d4] font-mono">Lv. {newLevel}</span>
              </div>
            </div>

            {/* Attribute Gain Pill Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3 rounded-xl bg-[#12121a] border border-[#1f1f2e] flex items-center justify-between">
                <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#8b5cf6]" /> Max HP
                </span>
                <span className="text-xs font-mono font-bold text-[#10b981]">+50</span>
              </div>

              <div className="p-3 rounded-xl bg-[#12121a] border border-[#1f1f2e] flex items-center justify-between">
                <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> Stat Points
                </span>
                <span className="text-xs font-mono font-bold text-[#f59e0b]">+5</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 text-sm font-black rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f59e0b] text-white shadow-xl glow-purple hover:brightness-110 transition-all uppercase tracking-wider"
            >
              Claim Rewards & Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
