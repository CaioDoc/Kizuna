"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Plus, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { usePointsStore } from "@/store/usePointsStore";
import { HabitCard } from "@/components/habits/HabitCard";
import { ContributionGraph } from "@/components/habits/ContributionGraph";
import { HabitCalendarView } from "@/components/habits/HabitCalendarView";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { HabitStatsModal } from "@/components/habits/HabitStatsModal";
import { DatabaseHabit } from "@/types";
import { playCompletionSound } from "@/lib/audio";
import confetti from "canvas-confetti";

export default function HabitsPage() {
  const habits = useEntitiesStore((state) => state.habits);
  const deleteEntity = useEntitiesStore((state) => state.deleteEntity);
  const earnPoints = usePointsStore((state) => state.earnPoints);

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<DatabaseHabit | null>(null);
  const [statsHabit, setStatsHabit] = useState<DatabaseHabit | null>(null);

  const handleToggleHabit = async (habit: DatabaseHabit) => {
    const isCompleted = !completedMap[habit.id];
    setCompletedMap((prev) => ({ ...prev, [habit.id]: isCompleted }));

    if (isCompleted) {
      await earnPoints(habit.reward_points, habit.id, "habit", habit.attribute_type, habit.attribute_xp);
    }
  };

  const handleCompleteAll = async () => {
    playCompletionSound();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#8b5cf6", "#06b6d4", "#f59e0b"],
    });

    const newMap: Record<string, boolean> = {};
    for (const h of habits) {
      newMap[h.id] = true;
      if (!completedMap[h.id]) {
        await earnPoints(h.reward_points, h.id, "habit", h.attribute_type, h.attribute_xp);
      }
    }
    setCompletedMap(newMap);
  };

  const handleResetChecklist = () => {
    setCompletedMap({});
  };

  const handleDelete = async (id: string) => {
    await deleteEntity("habit", id);
  };

  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const isAllDone = habits.length > 0 && completedCount === habits.length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181028] via-[#12121a] to-[#0d1b2a] border border-[#8b5cf6]/30 p-6 sm:p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#06b6d4]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-xs font-mono text-[#06b6d4]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DAILY ROUTINE SYSTEM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Habits & <span className="anime-gradient-text">Dailies</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Maintain your daily streaks to power up your hero attributes. Every habit check-in awards attribute XP.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingHabit(null);
                setIsCreateOpen(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#f59e0b] text-white text-xs font-black uppercase tracking-wider shadow-xl glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Habit Routine</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* TODAY'S HABITS CHECKLIST (Prominent Section) */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1f1f2e] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f2e] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Today&apos;s Routine Checklist</h2>
              <p className="text-xs text-gray-400 font-mono">
                {completedCount} / {habits.length} Routines Checked Today
              </p>
            </div>
          </div>

          {/* Checklist Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompleteAll}
              disabled={isAllDone}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                isAllDone
                  ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white shadow-lg glow-purple hover:brightness-110"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAllDone ? "All Done Today! ✓" : "Complete All Routines"}</span>
            </button>

            <button
              onClick={handleResetChecklist}
              className="p-2.5 rounded-xl bg-[#12121a] hover:bg-[#1f1f2e] text-gray-400 hover:text-white border border-[#1f1f2e] transition-colors"
              title="Reset Today Checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habit Cards Checklist Grid */}
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompletedToday={!!completedMap[habit.id]}
              streakCount={completedMap[habit.id] ? 8 : 7}
              onToggle={handleToggleHabit}
              onEdit={(h) => {
                setEditingHabit(h);
                setIsCreateOpen(true);
              }}
              onDelete={handleDelete}
              onViewStats={(h) => setStatsHabit(h)}
            />
          ))}
        </div>
      </section>

      {/* CONSISTENCY MATRIX & MONTH CALENDAR SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContributionGraph />
        <HabitCalendarView />
      </div>

      {/* MODALS */}
      <CreateHabitModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        editingHabit={editingHabit}
      />

      <HabitStatsModal
        habit={statsHabit}
        isOpen={!!statsHabit}
        onClose={() => setStatsHabit(null)}
      />
    </div>
  );
}
