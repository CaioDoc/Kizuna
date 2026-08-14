"use client";

import React from "react";
import { motion } from "framer-motion";
import { Coins, Clock, Dumbbell, Zap, Brain, BookOpen, Sparkles, Shield } from "lucide-react";
import { DatabaseQuest, DatabaseTask } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

export interface QuestCardProps {
  quest: DatabaseQuest;
  tasks: DatabaseTask[];
  onViewDetails: (quest: DatabaseQuest) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

export function QuestCard({ quest, tasks, onViewDetails }: QuestCardProps) {
  const attributeMeta = ATTRIBUTES_CONFIG[quest.attribute_type || "str"];
  const linkedTasks = tasks.filter((t) => t.quest_id === quest.id);
  const completedTasksCount = linkedTasks.filter((t) => t.status === "completed").length;
  const totalTasks = linkedTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : (quest.status === "completed" ? 100 : 0);

  let dueDateText = "No deadline";
  if (quest.target_date) {
    try {
      const parsedDate = parseISO(quest.target_date);
      if (isValid(parsedDate)) {
        dueDateText = formatDistanceToNow(parsedDate, { addSuffix: true });
      }
    } catch {
      dueDateText = quest.target_date;
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onViewDetails(quest)}
      className="group relative cursor-pointer rounded-2xl bg-[#12121a] border border-[#1f1f2e] hover:border-[#8b5cf6]/50 p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all duration-300 overflow-hidden"
    >
      {/* Top Header Row */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Left Side: Attribute Icon Box */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border-2 ${attributeMeta.borderColor} ${attributeMeta.bgColor} ${attributeMeta.textColor} shadow-md shrink-0`}
        >
          {ICON_MAP[attributeMeta.iconName] || <Sparkles className="w-5 h-5" />}
        </div>

        {/* Quest Info */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <span className={`text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}>
              {attributeMeta.fullName} (+{quest.attribute_xp} XP)
            </span>

            {/* Status Pill */}
            <span
              className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                quest.status === "completed"
                  ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40"
                  : quest.status === "abandoned"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/40"
              }`}
            >
              {quest.status}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#a78bfa] transition-colors leading-snug break-words">
            {quest.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {quest.description || "No bounty description provided."}
          </p>
        </div>
      </div>

      {/* Rewards & Progress Footer */}
      <div className="space-y-3 pt-3 border-t border-[#1f1f2e]">
        <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
          {/* Gold Bounty Badge */}
          <div className="flex items-center gap-1.5 text-[#f59e0b] font-bold">
            <Coins className="w-4 h-4" />
            <span>+{quest.reward_points} Gold</span>
          </div>

          {/* Due Date Indicator */}
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>{dueDateText}</span>
          </div>
        </div>

        {/* Task Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-gray-400">
            <span>Sub-Tasks Cleared</span>
            <span>
              {completedTasksCount} / {totalTasks} ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#0a0a0f] rounded-full overflow-hidden p-[1px] border border-[#1f1f2e]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: attributeMeta.color,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
