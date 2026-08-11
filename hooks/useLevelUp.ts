"use client";

import { useState, useCallback } from "react";

export function useLevelUp() {
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [oldLevel, setOldLevel] = useState(1);
  const [newLevel, setNewLevel] = useState(2);

  const triggerLevelUp = useCallback((oldLv: number, newLv: number) => {
    if (newLv > oldLv) {
      setOldLevel(oldLv);
      setNewLevel(newLv);
      setIsLevelUpOpen(true);
    }
  }, []);

  const closeLevelUp = useCallback(() => {
    setIsLevelUpOpen(false);
  }, []);

  return {
    isLevelUpOpen,
    oldLevel,
    newLevel,
    triggerLevelUp,
    closeLevelUp,
  };
}
