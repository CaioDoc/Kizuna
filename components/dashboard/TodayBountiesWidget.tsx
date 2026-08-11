"use client";

import React from "react";
import { CheckCircle2, Circle, Swords } from "lucide-react";
import { DatabaseTask } from "@/types";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { playCompletionSound } from "@/lib/audio";

export interface TodayBountiesWidgetProps {
  tasks: DatabaseTask[];
}

export function TodayBountiesWidget({ tasks }: TodayBountiesWidgetProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity);
  const earnPoints = usePointsStore((state) => state.earnPoints);

  const activeTasks = tasks.filter((t) => t.status !== "completed").slice(0, 3);

  const handleToggleTask = async (task: DatabaseTask) => {
    playCompletionSound();
    await updateEntity("task", task.id, { status: "completed" });
    await earnPoints(task.reward_points, task.id, "task", task.attribute_type, task.attribute_xp);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[#ffffff] text-sm font-black uppercase tracking-wider font-mono flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#8b5cf6]" />
            Today&apos;s Priority Bounties
          </h3>
          <span className="text-[10px] font-mono text-gray-400">{activeTasks.length} Urgent</span>
        </div>

        <div className="space-y-2">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => {
              const attributeMeta = ATTRIBUTES_CONFIG[task.attribute_type || "str"];
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className="p-3 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] hover:border-[#8b5cf6]/40 cursor-pointer flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Circle className="w-5 h-5 text-gray-500 hover:text-[#10b981] shrink-0" />
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="font-bold text-xs text-white truncate">{task.title}</h4>
                      <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ${attributeMeta.badgeBorder} ${attributeMeta.bgColor} ${attributeMeta.textColor}`}>
                        {attributeMeta.label} (+{task.attribute_xp} XP)
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#f59e0b] shrink-0">
                    +{task.reward_points} Gold
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500 space-y-1">
              <CheckCircle2 className="w-6 h-6 mx-auto text-[#10b981]" />
              <p className="text-xs font-medium">All priority bounties cleared for today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
