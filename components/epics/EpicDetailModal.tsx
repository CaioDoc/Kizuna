"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Swords, CheckCircle2, Coins } from "lucide-react";
import { DatabaseEpic, DatabaseQuest } from "@/types";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import confetti from "canvas-confetti";

export interface EpicDetailModalProps {
  epic: DatabaseEpic | null;
  quests: DatabaseQuest[];
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80";

export function EpicDetailModal({ epic, quests, isOpen, onClose }: EpicDetailModalProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity);
  const earnPoints = usePointsStore((state) => state.earnPoints);

  if (!epic) return null;

  const linkedQuests = quests.filter((q) => q.epic_id === epic.id);
  const completedQuests = linkedQuests.filter((q) => q.status === "completed");
  const totalXpEarned = completedQuests.reduce((sum, q) => sum + (q.attribute_xp || 50), 0);
  const progressPercentage = linkedQuests.length > 0 ? Math.round((completedQuests.length / linkedQuests.length) * 100) : 0;

  const handleMarkCompleted = async () => {
    // Fire celebratory confetti explosion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"],
    });

    await updateEntity("epic", epic.id, { status: "completed" });
    await earnPoints(500, epic.id, "epic", "str", 250);
  };

  const handleMarkAbandoned = async () => {
    await updateEntity("epic", epic.id, { status: "abandoned" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Top Banner Image */}
            <div className="relative h-48 w-full -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] overflow-hidden rounded-t-3xl bg-[#0a0a0f]">
              <Image
                src={epic.image_url || DEFAULT_BANNER}
                alt={epic.title}
                fill
                className="object-cover opacity-90"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/60 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-300 hover:text-white bg-black/60 hover:bg-black/80 backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Status Badge inside Banner */}
              <div className="absolute bottom-4 left-6 right-6 space-y-1">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${
                    epic.status === "completed"
                      ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40"
                      : epic.status === "abandoned"
                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                      : "bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/40"
                  }`}
                >
                  {epic.status} CAMPAIGN
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">{epic.title}</h2>
              </div>
            </div>

            {/* Campaign Metrics Pill Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e]">
                <div className="text-[10px] text-gray-400 font-mono uppercase">Campaign Progress</div>
                <div className="text-lg font-black text-[#06b6d4] font-mono mt-0.5">{progressPercentage}%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e]">
                <div className="text-[10px] text-gray-400 font-mono uppercase">Total XP Earned</div>
                <div className="text-lg font-black text-[#8b5cf6] font-mono mt-0.5">+{totalXpEarned} XP</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] col-span-2 sm:col-span-1">
                <div className="text-[10px] text-gray-400 font-mono uppercase">Campaign Reward</div>
                <div className="text-sm font-bold text-[#f59e0b] mt-0.5 flex items-center gap-1">
                  <Coins className="w-4 h-4" /> +500 Gold
                </div>
              </div>
            </div>

            {/* Campaign Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-[#0a0a0f] p-4 rounded-xl border border-[#1f1f2e]">
                {epic.description || "No detailed description set for this epic."}
              </p>
            </div>

            {/* Quest Timeline Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-gray-300 uppercase flex items-center gap-2">
                  <Swords className="w-4 h-4 text-[#8b5cf6]" /> Linked Quest Timeline ({linkedQuests.length})
                </h3>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {linkedQuests.length > 0 ? (
                  linkedQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            quest.status === "completed"
                              ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                              : quest.status === "abandoned"
                              ? "bg-red-500"
                              : "bg-[#8b5cf6]"
                          }`}
                        />
                        <div>
                          <div className="font-bold text-sm text-gray-200">{quest.title}</div>
                          <div className="text-[11px] text-gray-400">{quest.description}</div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#8b5cf6]">
                        +{quest.attribute_xp} XP
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic py-2">No linked quests attached to this campaign yet.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {epic.status === "active" && (
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#1f1f2e]">
                <button
                  onClick={handleMarkCompleted}
                  className="w-full sm:flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white shadow-lg glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Claim Epic Victory (+500 Gold & +250 XP)
                </button>

                <button
                  onClick={handleMarkAbandoned}
                  className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all"
                >
                  Abandon
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
