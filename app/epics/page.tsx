"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, Filter } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { EpicCard } from "@/components/epics/EpicCard";
import { CreateEpicModal } from "@/components/epics/CreateEpicModal";
import { EpicDetailModal } from "@/components/epics/EpicDetailModal";
import { DatabaseEpic } from "@/types";

export default function EpicsPage() {
  const epics = useEntitiesStore((state) => state.epics);
  const quests = useEntitiesStore((state) => state.quests);

  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "abandoned">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState<DatabaseEpic | null>(null);

  const filteredEpics = filterStatus === "all"
    ? epics
    : epics.filter((e) => e.status === filterStatus);

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181028] via-[#12121a] to-[#0d1b2a] border border-[#8b5cf6]/30 p-6 sm:p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#06b6d4]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-xs font-mono text-[#a78bfa]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MASTER CAMPAIGN PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Your Epic <span className="anime-gradient-text">Journey</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Embark on legendary long-term campaigns, link bounties, track milestone achievements, and earn grand titles.
            </p>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f59e0b] text-white text-xs font-black uppercase tracking-wider shadow-xl glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Epic</span>
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-[#1f1f2e]">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Filter className="w-4 h-4 text-[#8b5cf6]" />
          <span>STATUS FILTER:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "active", "completed", "abandoned"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === status
                  ? "bg-[#8b5cf6] text-white shadow-lg glow-purple"
                  : "bg-[#12121a] text-gray-400 border border-[#1f1f2e] hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Epics Grid Layout (2-3 cols desktop, 1 col mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEpics.map((epic) => (
          <EpicCard
            key={epic.id}
            epic={epic}
            quests={quests}
            onViewDetails={(selected) => setSelectedEpic(selected)}
          />
        ))}
      </div>

      {/* Modals */}
      <CreateEpicModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EpicDetailModal
        epic={selectedEpic}
        quests={quests}
        isOpen={!!selectedEpic}
        onClose={() => setSelectedEpic(null)}
      />
    </div>
  );
}
