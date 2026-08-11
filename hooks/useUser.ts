"use client";

import { useGameStore } from "@/store/useGameStore";

export function useUser() {
  const user = useGameStore((state) => state.user);
  const updateUserProfile = useGameStore((state) => state.updateUserProfile);

  return {
    user,
    updateUserProfile,
  };
}
