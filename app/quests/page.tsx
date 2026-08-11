"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ArrowUpDown, Sparkles } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { QuestCard } from "@/components/quests/QuestCard";
import { CreateQuestModal } from "@/components/quests/CreateQuestModal";
import { QuestDetailModal } from "@/components/quests/QuestDetailModal";
import { DatabaseQuest, AttributeType } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";

type SortOption = "date" | "xp" | "attribute";

export default function QuestsPage() {
  const quests = useEntitiesStore((state) => state.quests);
  const tasks = useEntitiesStore((state) => state.tasks);

  const [searchQuery, setSearchQuery] = useState("");
  const [attributeFilter, setAttributeFilter] = useState<AttributeType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<DatabaseQuest | null>(null);

  // Filtered & Sorted Quests
  const processedQuests = useMemo(() => {
    return quests
      .filter((q) => {
        // Search filter
        const matchesSearch =
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Attribute filter
        const matchesAttr = attributeFilter === "all" || q.attribute_type === attributeFilter;

        return matchesSearch && matchesAttr;
      })
      .sort((a, b) => {
        if (sortBy === "xp") {
          return (b.reward_points + b.attribute_xp) - (a.reward_points + a.attribute_xp);
        }
        if (sortBy === "attribute") {
          return (a.attribute_type || "").localeCompare(b.attribute_type || "");
        }
        // default date sort
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [quests, searchQuery, attributeFilter, sortBy]);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-xs font-mono text-[#a78bfa]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACTIVE BOUNTY BOARD</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Quest <span className="anime-gradient-text">Bounties</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Complete active bounties to level up your Strength, Intelligence, Dexterity, Wisdom, Charisma, and Constitution.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f59e0b] text-white text-xs font-black uppercase tracking-wider shadow-xl glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Quest</span>
          </button>
        </div>
      </motion.div>

      {/* Controls Bar: Search, Filters & Sorting */}
      <div className="glass-panel p-4 rounded-2xl border border-[#1f1f2e] space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quest bounties by title or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-[#8b5cf6] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none font-mono"
            >
              <option value="date">Sort by: Date Added</option>
              <option value="xp">Sort by: XP & Gold Reward</option>
              <option value="attribute">Sort by: Attribute Type</option>
            </select>
          </div>
        </div>

        {/* Attribute Pills Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#1f1f2e]">
          <span className="text-[11px] font-mono text-gray-400 uppercase mr-1 shrink-0">Attributes:</span>

          <button
            onClick={() => setAttributeFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              attributeFilter === "all"
                ? "bg-[#8b5cf6] text-white shadow-md"
                : "bg-[#0a0a0f] text-gray-400 border border-[#1f1f2e] hover:text-white"
            }`}
          >
            All Stats
          </button>

          {(Object.keys(ATTRIBUTES_CONFIG) as AttributeType[]).map((attrKey) => {
            const meta = ATTRIBUTES_CONFIG[attrKey];
            const isSelected = attributeFilter === attrKey;
            return (
              <button
                key={attrKey}
                onClick={() => setAttributeFilter(attrKey)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  isSelected
                    ? `${meta.bgColor} ${meta.textColor} ${meta.badgeBorder} border shadow-md`
                    : "bg-[#0a0a0f] text-gray-400 border border-[#1f1f2e] hover:text-white"
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            tasks={tasks}
            onViewDetails={(q) => setSelectedQuest(q)}
          />
        ))}
      </div>

      {/* Modals */}
      <CreateQuestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <QuestDetailModal
        quest={selectedQuest}
        tasks={tasks}
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
      />
    </div>
  );
}
