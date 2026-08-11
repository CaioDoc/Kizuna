"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, Sparkles, CheckCircle2, Circle, Shield, Dumbbell, Zap, Brain, BookOpen } from "lucide-react";
import { DatabaseQuest, DatabaseTask } from "@/types";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import confetti from "canvas-confetti";

export interface QuestDetailModalProps {
  quest: DatabaseQuest | null;
  tasks: DatabaseTask[];
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

export function QuestDetailModal({ quest, tasks, isOpen, onClose }: QuestDetailModalProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity);
  const earnPoints = usePointsStore((state) => state.earnPoints);

  if (!quest) return null;

  const attributeMeta = ATTRIBUTES_CONFIG[quest.attribute_type || "str"];
  const linkedTasks = tasks.filter((t) => t.quest_id === quest.id);
  const completedTasksCount = linkedTasks.filter((t) => t.status === "completed").length;
  const allTasksCompleted = linkedTasks.length > 0 ? completedTasksCount === linkedTasks.length : true;

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    await updateEntity("task", taskId, { status: newStatus });
  };

  const handleCompleteQuest = async () => {
    // Fire celebratory confetti explosion
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: [attributeMeta.color, "#8b5cf6", "#06b6d4", "#f59e0b"],
    });

    await updateEntity("quest", quest.id, { status: "completed" });
    await earnPoints(quest.reward_points, quest.id, "quest", quest.attribute_type, quest.attribute_xp);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-3 rounded-2xl border-2 ${attributeMeta.borderColor} ${attributeMeta.bgColor} ${attributeMeta.textColor} shadow-md`}
                >
                  {ICON_MAP[attributeMeta.iconName] || <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}>
                      {attributeMeta.fullName} BOUNTY
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      Status: {quest.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">{quest.title}</h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e] hover:bg-[#2e2e42] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attribute & Reward Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Gold Coin Reward</div>
                <div className="text-xl font-black text-[#f59e0b] font-mono flex items-center gap-1.5">
                  <Coins className="w-5 h-5 text-[#f59e0b]" /> +{quest.reward_points} Gold
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-1">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Attribute XP Bonus</div>
                <div className={`text-xl font-black font-mono flex items-center gap-1.5 ${attributeMeta.textColor}`}>
                  <Sparkles className="w-5 h-5" /> +{quest.attribute_xp} {attributeMeta.label} XP
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase">Quest Briefing</h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-[#0a0a0f] p-4 rounded-xl border border-[#1f1f2e]">
                {quest.description || "No description specified for this quest."}
              </p>
            </div>

            {/* Interactive Sub-Task Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Sub-Tasks Checklist ({completedTasksCount}/{linkedTasks.length})
                </h3>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {linkedTasks.length > 0 ? (
                  linkedTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        task.status === "completed"
                          ? "bg-[#10b981]/10 border-[#10b981]/40 text-gray-400"
                          : "bg-[#0a0a0f] border-[#1f1f2e] text-gray-200 hover:border-[#8b5cf6]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={`text-sm font-medium ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                          {task.title}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#8b5cf6]">
                        +{task.attribute_xp} XP
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic py-2">No sub-tasks attached to this quest bounty.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {quest.status !== "completed" ? (
              <div className="pt-4 border-t border-[#1f1f2e]">
                <button
                  onClick={handleCompleteQuest}
                  disabled={!allTasksCompleted}
                  className={`w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                    allTasksCompleted
                      ? "bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#10b981] text-white shadow-lg glow-purple hover:brightness-110"
                      : "bg-[#12121a] text-gray-500 border border-[#1f1f2e] cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {allTasksCompleted
                    ? `Claim Quest Bounty (+${quest.reward_points} Gold & +${quest.attribute_xp} ${attributeMeta.label} XP)`
                    : "Complete all sub-tasks to claim bounty"}
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-center font-mono font-bold text-xs text-[#10b981]">
                ✓ Bounty Cleared & Rewards Claimed
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
