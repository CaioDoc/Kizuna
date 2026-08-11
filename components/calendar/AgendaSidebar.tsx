"use client";

import React from "react";
import { format } from "date-fns";
import { Sun, Sunset, Clock, Plus, CheckCircle2, Circle } from "lucide-react";
import { DatabaseTask, DatabaseHabit } from "@/types";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import { playCompletionSound } from "@/lib/audio";

export interface AgendaSidebarProps {
  selectedDate: Date;
  tasks: DatabaseTask[];
  habits: DatabaseHabit[];
  onNewEvent: () => void;
}

export function AgendaSidebar({
  selectedDate,
  tasks,
  habits,
  onNewEvent,
}: AgendaSidebarProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity);
  const earnPoints = usePointsStore((state) => state.earnPoints);

  const handleToggleTask = async (task: DatabaseTask) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    if (newStatus === "completed") {
      playCompletionSound();
      await earnPoints(task.reward_points, task.id, "task", task.attribute_type, task.attribute_xp);
    }
    await updateEntity("task", task.id, { status: newStatus });
  };

  const morningTasks = tasks.slice(0, 1);
  const afternoonTasks = tasks.slice(1, 3);
  const anytimeHabits = habits.slice(0, 3);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-3">
          <div>
            <span className="text-[10px] font-mono text-[#f59e0b] font-bold uppercase">AGENDA SIDEBAR</span>
            <h3 className="text-lg font-black text-white">{format(selectedDate, "EEE, MMM d")}</h3>
          </div>
          <button
            onClick={onNewEvent}
            className="p-2 rounded-xl bg-[#8b5cf6]/20 text-[#a78bfa] hover:bg-[#8b5cf6] hover:text-white border border-[#8b5cf6]/40 transition-all"
            title="Add Event"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Morning Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f59e0b]">
            <Sun className="w-3.5 h-3.5" />
            <span>Morning (06:00 - 12:00)</span>
          </div>

          <div className="space-y-1.5">
            {morningTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleToggleTask(t)}
                className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] text-xs flex items-center justify-between cursor-pointer hover:border-[#8b5cf6]/40"
              >
                <div className="flex items-center gap-2">
                  {t.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={`font-medium ${t.status === "completed" ? "line-through text-gray-400" : "text-white"}`}>
                    {t.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Afternoon Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#06b6d4]">
            <Sunset className="w-3.5 h-3.5" />
            <span>Afternoon (12:00 - 18:00)</span>
          </div>

          <div className="space-y-1.5">
            {afternoonTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleToggleTask(t)}
                className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] text-xs flex items-center justify-between cursor-pointer hover:border-[#8b5cf6]/40"
              >
                <div className="flex items-center gap-2">
                  {t.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={`font-medium ${t.status === "completed" ? "line-through text-gray-400" : "text-white"}`}>
                    {t.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anytime Habits */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#10b981]">
            <Clock className="w-3.5 h-3.5" />
            <span>Anytime Routines</span>
          </div>

          <div className="space-y-1.5">
            {anytimeHabits.map((h) => (
              <div
                key={h.id}
                className="p-2.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] text-xs flex items-center justify-between text-gray-300"
              >
                <span>• {h.title}</span>
                <span className="text-[10px] font-mono text-[#f59e0b]">+{h.attribute_xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={onNewEvent}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white text-xs font-black uppercase tracking-wider shadow-lg glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Calendar Event
      </button>
    </div>
  );
}
