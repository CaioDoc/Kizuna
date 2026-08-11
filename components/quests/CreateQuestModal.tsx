"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Swords, Coins, Calendar, Plus, Trash2, Dumbbell, Zap, Brain, BookOpen, Sparkles, Shield } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { useUserStore } from "@/store/useUserStore";
import { AttributeType } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";

const createQuestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  epic_id: z.string().optional(),
  attribute_type: z.enum(["str", "dex", "int", "wis", "cha", "con"]),
  reward_points: z.number().min(5, "Minimum 5 gold reward"),
  attribute_xp: z.number().min(10, "Minimum 10 attribute XP"),
  target_date: z.string().min(1, "Target date is required"),
});

type CreateQuestFormValues = z.infer<typeof createQuestSchema>;

export interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
};

function generateUniqueId(prefix: string) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-1001`;
}

export function CreateQuestModal({ isOpen, onClose }: CreateQuestModalProps) {
  const createEntity = useEntitiesStore((state) => state.createEntity);
  const epics = useEntitiesStore((state) => state.epics);
  const currentUser = useUserStore((state) => state.currentUser);

  const [selectedAttribute, setSelectedAttribute] = useState<AttributeType>("str");
  const [taskInputs, setTaskInputs] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateQuestFormValues>({
    resolver: zodResolver(createQuestSchema),
    defaultValues: {
      title: "",
      description: "",
      epic_id: "",
      attribute_type: "str",
      reward_points: 50,
      attribute_xp: 100,
      target_date: "2026-08-30",
    },
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      setTaskInputs([...taskInputs, newTaskTitle.trim()]);
      setNewTaskTitle("");
    }
  };

  const handleRemoveTask = (index: number) => {
    setTaskInputs(taskInputs.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: CreateQuestFormValues) => {
    setIsSubmitting(true);
    try {
      const questId = generateUniqueId("quest");
      await createEntity("quest", {
        id: questId,
        user_id: currentUser?.id || "demo-user-id",
        epic_id: values.epic_id || null,
        title: values.title,
        description: values.description,
        status: "active",
        reward_points: Number(values.reward_points),
        attribute_type: values.attribute_type,
        attribute_xp: Number(values.attribute_xp),
        target_date: values.target_date,
      });

      // Create linked tasks
      for (const tTitle of taskInputs) {
        await createEntity("task", {
          quest_id: questId,
          user_id: currentUser?.id || "demo-user-id",
          title: tTitle,
          status: "pending",
          reward_points: 10,
          attribute_type: values.attribute_type,
          attribute_xp: 15,
        });
      }

      reset();
      setTaskInputs([]);
      onClose();
    } catch (err) {
      console.error("Failed to create quest:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Create New Quest Bounty</h2>
                  <p className="text-xs text-gray-400">Post an active bounty and gain stat XP.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e] hover:bg-[#2e2e42] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Parent Epic Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Parent Epic Campaign (Optional)
                </label>
                <select
                  {...register("epic_id")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors"
                >
                  <option value="">-- Standalone Quest (No Epic) --</option>
                  {epics.map((epic) => (
                    <option key={epic.id} value={epic.id}>
                      {epic.title} ({epic.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Quest Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Next.js 14 Server Actions"
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors"
                />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Quest Objectives & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed objectives of this bounty..."
                  {...register("description")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors resize-none"
                />
                {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
              </div>

              {/* Attribute Selector (6 RPG stats) */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Primary RPG Attribute Target
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(Object.keys(ATTRIBUTES_CONFIG) as AttributeType[]).map((attrKey) => {
                    const meta = ATTRIBUTES_CONFIG[attrKey];
                    const isSelected = selectedAttribute === attrKey;
                    return (
                      <button
                        type="button"
                        key={attrKey}
                        onClick={() => {
                          setSelectedAttribute(attrKey);
                          setValue("attribute_type", attrKey);
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? `${meta.borderColor} ${meta.bgColor} ${meta.textColor} font-bold shadow-md`
                            : "border-[#1f1f2e] bg-[#0a0a0f] text-gray-400 hover:text-white"
                        }`}
                      >
                        {ICON_MAP[meta.iconName]}
                        <span className="text-[10px] font-mono font-bold uppercase">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* XP & Gold Reward Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-[#f59e0b]" /> Gold Bounty
                  </label>
                  <input
                    type="number"
                    {...register("reward_points", { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-mono"
                  />
                  {errors.reward_points && <p className="text-xs text-red-400">{errors.reward_points.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" /> Attribute XP Gain
                  </label>
                  <input
                    type="number"
                    {...register("attribute_xp", { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-mono"
                  />
                  {errors.attribute_xp && <p className="text-xs text-red-400">{errors.attribute_xp.message}</p>}
                </div>
              </div>

              {/* Target Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#06b6d4]" /> Target Deadline
                </label>
                <input
                  type="date"
                  {...register("target_date")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-mono"
                />
              </div>

              {/* Dynamic Task Checklist Builder */}
              <div className="space-y-2 pt-2 border-t border-[#1f1f2e]">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Linked Sub-Tasks Checklist
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add sub-task..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="px-4 py-2.5 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6] text-[#a78bfa] hover:text-white border border-[#8b5cf6]/40 text-xs font-bold transition-all"
                  >
                    Add Task
                  </button>
                </div>

                {/* Sub-tasks list */}
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {taskInputs.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0a0f] border border-[#1f1f2e] text-xs text-gray-300"
                    >
                      <span>• {t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white shadow-lg glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? "Posting Bounty..." : "Post Quest Bounty"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
