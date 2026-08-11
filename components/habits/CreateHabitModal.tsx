"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Coins, Sparkles, Plus, Clock, Dumbbell, Zap, Brain, BookOpen, Shield } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { useUserStore } from "@/store/useUserStore";
import { AttributeType, DatabaseHabit } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";

const createHabitSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  attribute_type: z.enum(["str", "dex", "int", "wis", "cha", "con"]),
  reward_points: z.number().min(5, "Minimum 5 gold reward"),
  attribute_xp: z.number().min(5, "Minimum 5 attribute XP"),
});

type CreateHabitFormValues = z.infer<typeof createHabitSchema>;

export interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingHabit?: DatabaseHabit | null;
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
  return `${prefix}-2002`;
}

export function CreateHabitModal({ isOpen, onClose, editingHabit }: CreateHabitModalProps) {
  const createEntity = useEntitiesStore((state) => state.createEntity);
  const updateEntity = useEntitiesStore((state) => state.updateEntity);
  const currentUser = useUserStore((state) => state.currentUser);

  const [selectedAttribute, setSelectedAttribute] = useState<AttributeType>(
    editingHabit?.attribute_type || "str"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateHabitFormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      title: editingHabit?.title || "",
      description: editingHabit?.description || "",
      frequency: editingHabit?.frequency || "daily",
      attribute_type: editingHabit?.attribute_type || "str",
      reward_points: editingHabit?.reward_points || 25,
      attribute_xp: editingHabit?.attribute_xp || 50,
    },
  });

  const onSubmit = async (values: CreateHabitFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingHabit) {
        await updateEntity("habit", editingHabit.id, {
          title: values.title,
          description: values.description || null,
          frequency: values.frequency,
          attribute_type: values.attribute_type,
          reward_points: values.reward_points,
          attribute_xp: values.attribute_xp,
        });
      } else {
        await createEntity("habit", {
          id: generateUniqueId("habit"),
          user_id: currentUser?.id || "demo-user-id",
          title: values.title,
          description: values.description || null,
          frequency: values.frequency,
          attribute_type: values.attribute_type,
          reward_points: values.reward_points,
          attribute_xp: values.attribute_xp,
          is_active: true,
        });
      }

      reset();
      onClose();
    } catch (err) {
      console.error("Failed to save habit:", err);
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
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-[#06b6d4]">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    {editingHabit ? "Edit Habit Routine" : "Create New Habit Routine"}
                  </h2>
                  <p className="text-xs text-gray-400">Establish daily consistency for RPG attribute growth.</p>
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
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Habit Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Read 20 pages of Tech documentation"
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors"
                />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Description / Routine Details
                </label>
                <input
                  type="text"
                  placeholder="Optional details or instructions..."
                  {...register("description")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors"
                />
              </div>

              {/* Frequency Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#06b6d4]" /> Frequency Schedule
                </label>
                <select
                  {...register("frequency")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none"
                >
                  <option value="daily">Daily Routine</option>
                  <option value="weekly">Weekly Routine</option>
                  <option value="monthly">Monthly Routine</option>
                </select>
              </div>

              {/* Attribute Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Primary RPG Attribute Trained
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
                    <Coins className="w-3.5 h-3.5 text-[#f59e0b]" /> Gold Reward
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
                    <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" /> Stat XP Bonus
                  </label>
                  <input
                    type="number"
                    {...register("attribute_xp", { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-mono"
                  />
                  {errors.attribute_xp && <p className="text-xs text-red-400">{errors.attribute_xp.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white shadow-lg glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : editingHabit ? "Update Habit Routine" : "Establish Habit Routine"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
