"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Flame, Coins, Sparkles, Edit, Trophy, Swords, CheckSquare, Dumbbell, Zap, Brain, BookOpen, QrCode } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { usePointsStore } from "@/store/usePointsStore";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { XpBar } from "@/components/ui/XpBar";
import { AttributeRadarChart } from "@/components/profile/AttributeRadarChart";
import { AchievementsGrid } from "@/components/profile/AchievementsGrid";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { MobileQrModal } from "@/components/ui/MobileQrModal";
import { calculateCharacterClass, INITIAL_ACHIEVEMENTS } from "@/lib/character";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { AttributeType } from "@/types";
import { getXpProgress, calculateXpForLevel } from "@/lib/leveling";

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

export default function ProfilePage() {
  const currentUser = useUserStore((state) => state.currentUser);
  const totalLevel = useUserStore((state) => state.totalLevel);
  const totalXp = useUserStore((state) => state.totalXp);
  const attributes = useUserStore((state) => state.attributes);

  const balance = usePointsStore((state) => state.balance);
  const epics = useEntitiesStore((state) => state.epics);
  const quests = useEntitiesStore((state) => state.quests);
  const habits = useEntitiesStore((state) => state.habits);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const classInfo = calculateCharacterClass(attributes);
  const completedEpicsCount = epics.filter((e) => e.status === "completed").length;
  const completedQuestsCount = quests.filter((q) => q.status === "completed").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* HERO CHARACTER CARD HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 rounded-3xl border border-[#8b5cf6]/40 shadow-2xl relative overflow-hidden space-y-6"
      >
        {/* Glow Orbs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#06b6d4]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with Badge */}
          <div className="relative shrink-0">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#8b5cf6] glow-purple shadow-2xl">
              <Image
                src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=kizuna-hero"}
                alt={currentUser?.username || "Hero Avatar"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white text-xs font-black shadow-lg font-mono">
              Lv. {totalLevel}
            </div>
          </div>

          {/* Identity & RPG Class Info */}
          <div className="flex-1 space-y-3 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-black text-white">{currentUser?.username}</h1>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1.5 rounded-lg bg-[#1f1f2e] text-gray-400 hover:text-white transition-colors"
                    title="Edit Character Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {/* RPG Class Title */}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <span
                    className="px-3 py-0.5 rounded-full text-xs font-mono font-black uppercase tracking-wider shadow-md"
                    style={{ backgroundColor: `${classInfo.color}20`, color: classInfo.color, border: `1px solid ${classInfo.color}40` }}
                  >
                    {classInfo.className} Class • {classInfo.subTitle}
                  </span>
                </div>
              </div>

              {/* Gold, Streak & Mobile QR Action */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a0a0f] border border-[#f59e0b]/40 text-[#f59e0b] font-mono text-sm font-bold shadow-md">
                  <Coins className="w-4 h-4 text-[#f59e0b]" />
                  <span>{balance} Gold</span>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a0a0f] border border-red-500/40 text-red-400 font-mono text-sm font-bold shadow-md">
                  <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>{currentUser?.current_streak || 7}d Streak</span>
                </div>

                <button
                  onClick={() => setIsQrOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/35 border border-[#8b5cf6]/50 text-[#a78bfa] font-mono text-xs font-bold transition-all shadow-md"
                  title="Scan QR Code to access Web App on Smartphone"
                >
                  <QrCode className="w-4 h-4 text-[#8b5cf6]" />
                  <span>Mobile App QR</span>
                </button>
              </div>
            </div>

            {/* XpBar Integration */}
            <div className="pt-2">
              <XpBar level={totalLevel} currentXp={totalXp} />
            </div>
          </div>
        </div>

        {/* Lifetime Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1f1f2e]">
          <div className="p-3.5 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#8b5cf6]/20 text-[#8b5cf6]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Epics Cleared</div>
              <div className="text-base font-bold text-white font-mono">{completedEpicsCount} Campaigns</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#06b6d4]/20 text-[#06b6d4]">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Quests Completed</div>
              <div className="text-base font-bold text-white font-mono">{completedQuestsCount} Bounties</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#10b981]/20 text-[#10b981]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Habit Routines</div>
              <div className="text-base font-bold text-white font-mono">{habits.length} Active</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f59e0b]/20 text-[#f59e0b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">Hero Rank</div>
              <div className="text-base font-bold text-white font-mono">S-Class</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6 ATTRIBUTE PROGRESSION CARDS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#8b5cf6]" />
            RPG Attribute Breakdown
          </h2>
          <span className="text-xs font-mono text-gray-400">Dominant Stat: {classInfo.dominantAttribute.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ATTRIBUTES_CONFIG) as AttributeType[]).map((attrKey) => {
            const meta = ATTRIBUTES_CONFIG[attrKey];
            const attrData = attributes[attrKey] || { level: 1, xp: 0 };
            const isDominant = classInfo.dominantAttribute === attrKey;
            const progressPct = getXpProgress(attrData.xp, attrData.level);
            const nextLevelXp = calculateXpForLevel(attrData.level + 1);

            return (
              <motion.div
                key={attrKey}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`relative p-5 rounded-3xl bg-[#12121a] border ${meta.badgeBorder} shadow-xl space-y-4 overflow-hidden ${
                  isDominant ? "glow-purple border-[#8b5cf6]" : ""
                }`}
              >
                {isDominant && (
                  <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-[#8b5cf6] text-white text-[9px] font-mono font-black uppercase tracking-wider shadow-md">
                    Dominant Stat
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border-2 ${meta.borderColor} ${meta.bgColor} ${meta.textColor}`}>
                    {ICON_MAP[meta.iconName]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{meta.fullName}</h3>
                    <span className={`text-xs font-mono font-bold ${meta.textColor}`}>
                      Level {attrData.level}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Stat XP Progress</span>
                    <span>
                      {attrData.xp}/{nextLevelXp} ({progressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0a0a0f] rounded-full overflow-hidden p-[1px] border border-[#1f1f2e]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* RADAR ANALYTICS CHART & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttributeRadarChart stats={attributes} />
        </div>

        <div className="lg:col-span-2">
          <AchievementsGrid achievements={INITIAL_ACHIEVEMENTS} />
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {/* MOBILE QR MODAL */}
      <MobileQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />
    </div>
  );
}
