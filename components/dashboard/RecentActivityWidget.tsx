"use client";

import React from "react";
import { formatDistanceToNow, subHours, subMinutes } from "date-fns";
import { Activity, Sparkles, CheckCircle2, Trophy } from "lucide-react";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { AttributeType } from "@/types";

export interface ActivityItem {
  id: string;
  type: "quest" | "habit" | "epic" | "reward";
  title: string;
  attribute: AttributeType;
  xpGained: number;
  timestamp: Date;
}

const MOCK_TIMELINE: ActivityItem[] = [
  { id: "act-1", type: "quest", title: "Completed Quest: Master Next.js 14 Server Actions", attribute: "int", xpGained: 100, timestamp: subMinutes(new Date(), 25) },
  { id: "act-2", type: "habit", title: "Checked Habit: Morning 30-min Cardio Session", attribute: "str", xpGained: 50, timestamp: subHours(new Date(), 2) },
  { id: "act-3", type: "quest", title: "Completed Task: Design System Figma Token Review", attribute: "dex", xpGained: 40, timestamp: subHours(new Date(), 5) },
  { id: "act-4", type: "epic", title: "Claimed Milestone in Campaign: Master Full-Stack Web Architecture", attribute: "int", xpGained: 250, timestamp: subHours(new Date(), 12) },
  { id: "act-5", type: "habit", title: "Checked Habit: Read 20 pages of Tech Documentation", attribute: "wis", xpGained: 45, timestamp: subHours(new Date(), 24) },
];

export function RecentActivityWidget() {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#06b6d4]" />
          Recent Hero Activity Log
        </h3>
        <span className="text-[10px] font-mono text-gray-400">Live Timeline</span>
      </div>

      <div className="space-y-3">
        {MOCK_TIMELINE.map((item) => {
          const attributeMeta = ATTRIBUTES_CONFIG[item.attribute];
          const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true });

          return (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-xl border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor} shrink-0`}>
                  {item.type === "epic" ? <Trophy className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className="font-bold text-gray-200 truncate">{item.title}</h4>
                  <span className="text-[10px] font-mono text-gray-500">{timeAgo}</span>
                </div>
              </div>

              <div className={`font-mono font-black text-xs shrink-0 flex items-center gap-1 ${attributeMeta.textColor}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{item.xpGained} {attributeMeta.label} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
