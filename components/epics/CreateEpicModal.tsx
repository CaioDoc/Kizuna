"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Calendar, Sparkles, Plus, CheckCircle2 } from "lucide-react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { useUserStore } from "@/store/useUserStore";

const createEpicSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  target_date: z.string().min(1, "Target completion date is required"),
  image_url: z.string().optional(),
});

type CreateEpicFormValues = z.infer<typeof createEpicSchema>;

export interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEpicModal({ isOpen, onClose }: CreateEpicModalProps) {
  const createEntity = useEntitiesStore((state) => state.createEntity);
  const currentUser = useUserStore((state) => state.currentUser);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateEpicFormValues>({
    resolver: zodResolver(createEpicSchema),
    defaultValues: {
      title: "",
      description: "",
      target_date: "2026-09-30",
      image_url: "",
    },
  });

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

  const onSubmit = async (values: CreateEpicFormValues) => {
    setIsSubmitting(true);
    try {
      await createEntity("epic", {
        user_id: currentUser?.id || "demo-user-id",
        title: values.title,
        description: values.description,
        status: "active",
        target_date: values.target_date,
        image_url: values.image_url || null,
      });

      reset();
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error("Failed to create epic:", err);
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
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Create New Epic Campaign</h2>
                  <p className="text-xs text-gray-400">Set a grand master goal for your hero journey.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e] hover:bg-[#2e2e42] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Campaign Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk Full-Stack Ascendant"
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors"
                />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase">
                  Description & Objectives
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your master campaign goals..."
                  {...register("description")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors resize-none"
                />
                {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
              </div>

              {/* Target Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#06b6d4]" /> Target Completion Date
                </label>
                <input
                  type="date"
                  {...register("target_date")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none transition-colors"
                />
                {errors.target_date && <p className="text-xs text-red-400">{errors.target_date.message}</p>}
              </div>

              {/* Image Upload Dropzone & Preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#f59e0b]" /> Cover Banner Image
                </label>
                <div className="relative border-2 border-dashed border-[#1f1f2e] hover:border-[#8b5cf6] rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#0a0a0f]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono flex items-center gap-1 z-10">
                        <CheckCircle2 className="w-3 h-3" /> Image Ready
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 space-y-1 text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-500" />
                      <p className="text-xs font-medium">Click or drag image file here to upload</p>
                      <p className="text-[10px] text-gray-500">Supports PNG, JPG, WebP</p>
                    </div>
                  )}
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
                  {isSubmitting ? "Initiating Campaign..." : "Launch Campaign"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
