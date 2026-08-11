"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Plus, Clock, Sparkles } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { useUserStore } from "@/store/useUserStore";

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  entity_type: z.enum(["task", "quest", "habit"]),
  attribute_type: z.enum(["str", "dex", "int", "wis", "cha", "con"]),
  target_date: z.string().min(1, "Date is required"),
  xp_reward: z.number().min(10, "Minimum 10 XP"),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

function generateUniqueId(prefix: string) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-4004`;
}

export function CreateEventModal({ isOpen, onClose, selectedDate }: CreateEventModalProps) {
  const createEntity = useEntitiesStore((state) => state.createEntity);
  const currentUser = useUserStore((state) => state.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultDateStr = selectedDate.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      entity_type: "task",
      attribute_type: "str",
      target_date: defaultDateStr,
      xp_reward: 50,
    },
  });

  const onSubmit = async (values: CreateEventFormValues) => {
    setIsSubmitting(true);
    try {
      if (values.entity_type === "task") {
        await createEntity("task", {
          id: generateUniqueId("task"),
          user_id: currentUser?.id || "demo-user-id",
          title: values.title,
          status: "pending",
          reward_points: 20,
          attribute_type: values.attribute_type,
          attribute_xp: values.xp_reward,
        });
      } else if (values.entity_type === "habit") {
        await createEntity("habit", {
          id: generateUniqueId("habit"),
          user_id: currentUser?.id || "demo-user-id",
          title: values.title,
          frequency: "daily",
          attribute_type: values.attribute_type,
          reward_points: 15,
          attribute_xp: values.xp_reward,
          is_active: true,
        });
      } else {
        await createEntity("quest", {
          id: generateUniqueId("quest"),
          user_id: currentUser?.id || "demo-user-id",
          title: values.title,
          status: "active",
          reward_points: 100,
          attribute_type: values.attribute_type,
          attribute_xp: values.xp_reward,
          target_date: values.target_date,
        });
      }

      reset();
      onClose();
    } catch (err) {
      console.error("Failed to create calendar event:", err);
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
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Create Calendar Event</h2>
                  <p className="text-xs text-gray-400">Schedule tasks, quest milestones, or habits.</p>
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
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js 14 Code Review"
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-bold"
                />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                    Event Type
                  </label>
                  <select
                    {...register("entity_type")}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none font-mono"
                  >
                    <option value="task">Sub-Task Bounty</option>
                    <option value="quest">Quest Milestone</option>
                    <option value="habit">Daily Habit Routine</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                    Target Stat
                  </label>
                  <select
                    {...register("attribute_type")}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none font-mono uppercase"
                  >
                    <option value="str">STR (Strength)</option>
                    <option value="dex">DEX (Dexterity)</option>
                    <option value="int">INT (Intelligence)</option>
                    <option value="wis">WIS (Wisdom)</option>
                    <option value="cha">CHA (Charisma)</option>
                    <option value="con">CON (Constitution)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#06b6d4]" /> Date
                  </label>
                  <input
                    type="date"
                    {...register("target_date")}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" /> XP Yield
                  </label>
                  <input
                    type="number"
                    {...register("xp_reward", { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white shadow-lg glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? "Scheduling..." : "Schedule Calendar Event"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
