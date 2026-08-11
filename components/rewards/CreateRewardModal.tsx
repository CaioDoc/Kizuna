"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Coins, Image as ImageIcon, Plus, CheckCircle2 } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { useUserStore } from "@/store/useUserStore";
import { getRewardRarity, RARITY_CONFIG } from "./RewardCard";

const createRewardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  cost_points: z.number().min(10, "Minimum 10 gold cost"),
  image_url: z.string().optional(),
  is_reusable: z.boolean(),
});

type CreateRewardFormValues = z.infer<typeof createRewardSchema>;

export interface CreateRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateUniqueId(prefix: string) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-3003`;
}

export function CreateRewardModal({ isOpen, onClose }: CreateRewardModalProps) {
  const createEntity = useEntitiesStore((state) => state.createEntity);
  const currentUser = useUserStore((state) => state.currentUser);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateRewardFormValues>({
    resolver: zodResolver(createRewardSchema),
    defaultValues: {
      title: "",
      description: "",
      cost_points: 300,
      image_url: "",
      is_reusable: true,
    },
  });

  const currentCost = watch("cost_points") || 300;
  const currentRarity = getRewardRarity(currentCost);
  const rarityMeta = RARITY_CONFIG[currentRarity];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue("image_url", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: CreateRewardFormValues) => {
    setIsSubmitting(true);
    try {
      await createEntity("reward", {
        id: generateUniqueId("reward"),
        user_id: currentUser?.id || "demo-user-id",
        title: values.title,
        description: values.description,
        cost_points: values.cost_points,
        image_url: values.image_url || null,
        is_active: true,
      });

      reset();
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error("Failed to create reward:", err);
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
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#f59e0b]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Create Shop Reward Perk</h2>
                  <p className="text-xs text-gray-400">Add a custom real-world or digital perk to your shop vault.</p>
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
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Reward Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cheat Day Gourmet Ramen Bowl"
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#f59e0b] text-white text-sm outline-none transition-colors"
                />
                {errors.title && <p className="text-xs text-[#ef4444]">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Description & Reward Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your reward perk..."
                  {...register("description")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#f59e0b] text-white text-sm outline-none transition-colors resize-none"
                />
                {errors.description && <p className="text-xs text-[#ef4444]">{errors.description.message}</p>}
              </div>

              {/* Cost & Live Auto-Calculated Rarity Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-[#f59e0b]" /> Gold Coin Cost
                  </label>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${rarityMeta.badgeClass}`}>
                    Calculated Rarity: {currentRarity}
                  </span>
                </div>
                <input
                  type="number"
                  {...register("cost_points", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#f59e0b] text-white text-sm outline-none font-mono"
                />
                {errors.cost_points && <p className="text-xs text-[#ef4444]">{errors.cost_points.message}</p>}
              </div>

              {/* Image Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#06b6d4]" /> Perk Artwork / Cover Image
                </label>
                <div className="relative border-2 border-dashed border-[#1f1f2e] hover:border-[#f59e0b] rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#0a0a0f]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="relative h-28 w-full rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono flex items-center gap-1 z-10">
                        <CheckCircle2 className="w-3 h-3" /> Image Uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 space-y-1 text-gray-400">
                      <ImageIcon className="w-6 h-6 mx-auto text-gray-500" />
                      <p className="text-xs font-medium">Click or drag image file here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#06b6d4] text-white shadow-lg glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? "Adding Perk..." : "Add Shop Reward Perk"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
