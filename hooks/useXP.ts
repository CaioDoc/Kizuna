"use client";

import { useGameStore } from "@/store/useGameStore";

export function useXP() {
  const user = useGameStore((state) => state.user);
  const addXp = useGameStore((state) => state.addXp);

  const progressPercentage = Math.min(
    100,
    Math.round((user.currentXp / user.nextLevelXp) * 100)
  );

  return {
    level: user.level,
    currentXp: user.currentXp,
    nextLevelXp: user.nextLevelXp,
    progressPercentage,
    addXp,
  };
}
