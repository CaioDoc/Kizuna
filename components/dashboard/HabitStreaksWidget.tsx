"use client";

import React, { useState } from "react";
import { Flame, Check } from "lucide-react";
import { DatabaseHabit } from "@/types";
import { usePointsStore } from "@/store/usePointsStore";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { playCompletionSound } from "@/lib/audio";

export interface HabitStreaksWidgetProps {
  habits: DatabaseHabit[];
}

export function HabitStreaksWidget({ habits }: HabitStreaksWidgetProps) {
  const earnPoints = usePointsStore((state) => state.earnPoints);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const topHabits = habits.slice(0, 5);

  const handleToggleHabit = async (habit: DatabaseHabit) => {
    const isDone = !completedMap[habit.id];
    setCompletedMap((prev) => ({ ...prev, [habit.id]: isDone }));

    if (isDone) {
      playCompletionSound();
      await earnPoints(habit.reward_points, habit.id, "habit", habit.attribute_type, habit.attribute_xp);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            Top Habit Streaks
          </h3>
          <span className="text-[10px] font-mono text-gray-400">🔥 Daily Routines</span>
        </div>

        <div className="space-y-2">
          {topHabits.map((habit, idx) => {
            const isCompleted = !!completedMap[habit.id];
            const attributeMeta = ATTRIBUTES_CONFIG[habit.attribute_type || "str"];
            const streakVal = 7 + (topHabits.length - idx) * 3;

            return (
              <div
                key={habit.id}
                onClick={() => handleToggleHabit(habit)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isCompleted
                    ? "bg-[#10b981]/10 border-[#10b981]/40 text-gray-400"
                    : "bg-[#0a0a0f] border-[#1f1f2e] hover:border-[#8b5cf6]/40 text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      isCompleted ? "bg-[#10b981] border-[#10b981] text-white" : "border-gray-600 bg-[#0a0a0f]"
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className={`font-bold text-xs truncate ${isCompleted ? "line-through text-gray-400" : "text-white"}`}>
                      {habit.title}
                    </h4>
                    <span className={`text-[9px] font-mono font-bold ${attributeMeta.textColor}`}>
                      +{habit.attribute_xp} {attributeMeta.label} XP
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold shrink-0">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>{streakVal}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
