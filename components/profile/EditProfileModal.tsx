"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Image as ImageIcon, Check } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const editProfileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  avatar_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: currentUser?.username || "Ren Amamiya",
      avatar_url: currentUser?.avatar_url || "",
    },
  });

  const onSubmit = async (values: EditProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await updateUser({
        username: values.username,
        avatar_url: values.avatar_url || currentUser?.avatar_url || null,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
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
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Edit Character Profile</h2>
                  <p className="text-xs text-gray-400">Update your hero identity and avatar.</p>
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
                  Hero Username
                </label>
                <input
                  type="text"
                  {...register("username")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-bold"
                />
                {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#06b6d4]" /> Avatar Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  {...register("avatar_url")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1f1f2e] focus:border-[#8b5cf6] text-white text-sm outline-none font-mono"
                />
                {errors.avatar_url && <p className="text-xs text-red-400">{errors.avatar_url.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white shadow-lg glow-purple hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {isSubmitting ? "Saving Profile..." : "Save Character Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
