"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, Gift, Sparkles } from "lucide-react";
import { DatabaseReward } from "@/types";

export interface RedeemedItem {
  id: string;
  reward: DatabaseReward;
  redeemedAt: Date;
  isUsed: boolean;
}

export interface RedeemedHistorySectionProps {
  redeemedItems: RedeemedItem[];
  onToggleUsed: (id: string) => void;
}

export function RedeemedHistorySection({
  redeemedItems,
  onToggleUsed,
}: RedeemedHistorySectionProps) {
  const [filterPeriod, setFilterPeriod] = useState<"all" | "week" | "month">("all");

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1f1f2e] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f2e] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b]">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Redeemed Perks History</h2>
            <p className="text-xs text-gray-400 font-mono">
              Track unlocked rewards and mark when you enjoy them in real life.
            </p>
          </div>
        </div>

        {/* Filter Period Tabs */}
        <div className="flex items-center gap-2">
          {(["all", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                filterPeriod === period
                  ? "bg-[#8b5cf6] text-white shadow-md"
                  : "bg-[#0a0a0f] text-gray-400 border border-[#1f1f2e] hover:text-white"
              }`}
            >
              {period === "all" ? "All Time" : period === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {redeemedItems.length > 0 ? (
          redeemedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleUsed(item.id)}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                item.isUsed
                  ? "bg-[#10b981]/10 border-[#10b981]/40 text-gray-400"
                  : "bg-[#0a0a0f] border-[#1f1f2e] hover:border-[#8b5cf6]/40 text-white"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button className="text-gray-400 hover:text-white">
                  {item.isUsed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                <div className="min-w-0 space-y-0.5">
                  <h4 className={`font-bold text-sm truncate ${item.isUsed ? "line-through text-gray-400" : "text-gray-100"}`}>
                    {item.reward.title}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">{item.reward.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#06b6d4]" />
                  <span>{format(item.redeemedAt, "MMM d, h:mm a")}</span>
                </div>
                <span className="text-[#f59e0b] font-bold">-{item.reward.cost_points} Gold</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-gray-600" />
            <p className="text-xs font-medium">No redeemed perks yet. Earn gold by completing bounties to unlock rewards!</p>
          </div>
        )}
      </div>
    </div>
  );
}
