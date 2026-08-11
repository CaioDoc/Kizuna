"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swords, ArrowRight, Clock } from "lucide-react";
import { DatabaseEpic, DatabaseQuest } from "@/types";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

export interface EpicCardProps {
  epic: DatabaseEpic;
  quests: DatabaseQuest[];
  onViewDetails: (epic: DatabaseEpic) => void;
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80";

export function EpicCard({ epic, quests, onViewDetails }: EpicCardProps) {
  const linkedQuests = quests.filter((q) => q.epic_id === epic.id);
  const completedQuestsCount = linkedQuests.filter((q) => q.status === "completed").length;
  const totalQuests = linkedQuests.length;
  const progressPercentage = totalQuests > 0 ? Math.round((completedQuestsCount / totalQuests) * 100) : 0;

  // Format countdown target date
  let countdownText = "No deadline";
  if (epic.target_date) {
    try {
      const parsedDate = parseISO(epic.target_date);
      if (isValid(parsedDate)) {
        countdownText = formatDistanceToNow(parsedDate, { addSuffix: true });
      }
    } catch {
      countdownText = epic.target_date;
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl bg-[#12121a] border border-[#1f1f2e] hover:border-[#8b5cf6]/50 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300"
    >
      {/* Subtle Glowing Hover Accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-[#8b5cf6]/10 rounded-full blur-2xl group-hover:bg-[#8b5cf6]/20 transition-all pointer-events-none" />

      {/* Card Header & Banner Image */}
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-[#0a0a0f]">
          <Image
            src={epic.image_url || DEFAULT_BANNER}
            alt={epic.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/40 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider shadow-lg border backdrop-blur-md ${
                epic.status === "completed"
                  ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40"
                  : epic.status === "abandoned"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/40"
              }`}
            >
              {epic.status}
            </span>
          </div>

          {/* Target Countdown Pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0f]/80 backdrop-blur-md text-[11px] font-mono text-gray-300 border border-[#1f1f2e]">
            <Clock className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>{countdownText}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-extrabold text-white group-hover:text-[#a78bfa] transition-colors leading-tight">
              {epic.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
              {epic.description || "No description provided for this epic campaign."}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-[#8b5cf6]" />
                {completedQuestsCount} / {totalQuests} Quests Cleared
              </span>
              <span className="font-bold text-[#06b6d4]">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-[#0a0a0f] rounded-full overflow-hidden p-[1px] border border-[#1f1f2e]">
              <div
                className="h-full bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f59e0b] rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onViewDetails(epic)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#1f1f2e] hover:bg-[#8b5cf6] text-gray-200 hover:text-white border border-[#1f1f2e] hover:border-[#8b5cf6] transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:glow-purple"
        >
          <span>Campaign Intel & Quests</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
