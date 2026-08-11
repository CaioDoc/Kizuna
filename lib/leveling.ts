/**
 * RPG Leveling Utility Engine for Kizuna
 * Exponential progression curve formula:
 * Cumulative XP to reach level (L + 1) = 50 * L * (L + 1)
 *
 * Level 1: 0 - 100 XP (100 XP to level up)
 * Level 2: 100 - 300 XP (200 XP to level up)
 * Level 3: 300 - 600 XP (300 XP to level up)
 * Level 4: 600 - 1000 XP (400 XP to level up)
 */

/**
 * Returns the cumulative XP required to reach a specific target level.
 * Level 1 starts at 0 XP. Level 2 requires 100 cumulative XP, Level 3 requires 300, etc.
 */
export function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  const L = level - 1;
  return 50 * L * (L + 1);
}

/**
 * Calculates the current character level based on total cumulative XP.
 */
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  const level = Math.floor((-1 + Math.sqrt(1 + (4 * xp) / 50)) / 2) + 1;
  return Math.max(1, level);
}

/**
 * Returns the percentage progress (0 to 100) toward the next level.
 */
export function getXpProgress(currentXp: number, level: number): number {
  const currentLevelStartXp = calculateXpForLevel(level);
  const nextLevelXp = calculateXpForLevel(level + 1);
  const range = nextLevelXp - currentLevelStartXp;

  if (range <= 0) return 100;

  const currentLevelXp = Math.max(0, currentXp - currentLevelStartXp);
  const progress = Math.min(100, Math.max(0, (currentLevelXp / range) * 100));

  return Math.round(progress);
}

/**
 * Calculates the outcome of gaining XP, returning the new total XP, new level, and level-up flag.
 */
export interface XpGainResult {
  newXp: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  levelsGained: number;
}

export function applyXpGain(currentXp: number, gainedXp: number): XpGainResult {
  const safeCurrentXp = Math.max(0, currentXp);
  const safeGainedXp = Math.max(0, gainedXp);
  const newXp = safeCurrentXp + safeGainedXp;

  const oldLevel = calculateLevel(safeCurrentXp);
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;
  const levelsGained = Math.max(0, newLevel - oldLevel);

  return {
    newXp,
    oldLevel,
    newLevel,
    leveledUp,
    levelsGained,
  };
}
