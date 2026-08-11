"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { BookOpen, CheckCircle2, Circle, Save } from "lucide-react";
import { DatabaseTask, DatabaseHabit } from "@/types";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import { playCompletionSound } from "@/lib/audio";

export interface DayCalendarViewProps {
  selectedDate: Date;
  tasks: DatabaseTask[];
  habits: DatabaseHabit[];
}

export function DayCalendarView({
  selectedDate,
  tasks,
}: DayCalendarViewProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity);
  const earnPoints = usePointsStore((state) => state.earnPoints);

  const [journalNote, setJournalNote] = useState(
    "Focused 4 hours on mastering Next.js 14 Server Actions and Supabase RLS policies. Felt high energy!"
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleTask = async (task: DatabaseTask) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    if (newStatus === "completed") {
      playCompletionSound();
      await earnPoints(task.reward_points, task.id, "task", task.attribute_type, task.attribute_xp);
    }
    await updateEntity("task", task.id, { status: newStatus });
  };

  const handleSaveJournal = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#06b6d4] font-bold uppercase">DAILY AGENDA</span>
          <h2 className="text-xl font-extrabold text-white">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
        </div>
      </div>

      {/* Hourly Timeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-gray-300 uppercase">Hourly Timeline Bounties</h3>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                task.status === "completed"
                  ? "bg-[#10b981]/10 border-[#10b981]/40 text-gray-400"
                  : "bg-[#0a0a0f] border-[#1f1f2e] hover:border-[#8b5cf6]/40 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
                <span className={`text-sm font-medium ${task.status === "completed" ? "line-through text-gray-400" : "text-white"}`}>
                  {task.title}
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-[#8b5cf6]">
                +{task.attribute_xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily RPG Journal Note Editor */}
      <div className="space-y-2 pt-4 border-t border-[#1f1f2e]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-gray-300 uppercase flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#8b5cf6]" />
            Daily Hero Journal Entry
          </h3>
          <button
            onClick={handleSaveJournal}
            className="px-3 py-1.5 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6] text-[#a78bfa] hover:text-white border border-[#8b5cf6]/40 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? "Saved! ✓" : "Save Entry"}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={journalNote}
          onChange={(e) => setJournalNote(e.target.value)}
          placeholder="Log your achievements, reflections, and mindset notes for today..."
          className="w-full p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs leading-relaxed outline-none resize-none"
        />
      </div>
    </div>
  );
}
