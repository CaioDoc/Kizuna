"use client";

import React from "react";
import { DatabaseEpic, DatabaseQuest } from "@/types";
import { Target, Compass } from "lucide-react";

export interface ProgressOverviewWidgetProps {
  epics: DatabaseEpic[];
  quests: DatabaseQuest[];
}

export function ProgressOverviewWidget({ epics, quests }: ProgressOverviewWidgetProps) {
  const activeEpics = epics.filter((e) => e.status === "active").slice(0, 3);
  const activeQuestsCount = quests.filter((q) => q.status === "active").length;
  const completedQuestsCount = quests.filter((q) => q.status === "completed").length;
  const totalQuests = quests.length || 1;
  const overallWeeklyProgress = Math.round((completedQuestsCount / totalQuests) * 100);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Target className="w-4 h-4 text-[#8b5cf6]" />
          Campaigns & Weekly Progress
        </h3>
        <span className="text-[10px] font-mono text-[#10b981] font-bold">
          {overallWeeklyProgress}% Weekly Goal
        </span>
      </div>

      {/* Active Epics List */}
      <div className="space-y-3">
        {activeEpics.map((epic) => (
          <div key={epic.id} className="p-3.5 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-white truncate">
                <Compass className="w-4 h-4 text-[#06b6d4]" />
                <span className="truncate">{epic.title}</span>
              </div>
              <span className="font-mono text-gray-400 text-[11px]">Active</span>
            </div>

            <div className="w-full h-1.5 bg-[#12121a] rounded-full overflow-hidden p-[1px] border border-[#1f1f2e]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] w-2/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Gauge */}
      <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400">Active Bounties Remaining:</span>
        <span className="font-bold text-[#f59e0b] text-sm">{activeQuestsCount} Quests</span>
      </div>
    </div>
  );
}
