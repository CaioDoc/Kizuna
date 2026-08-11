import type { AttributeType, HabitFrequency } from "./database";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  streak: number;
  completed: boolean;
  xpReward: number;
  frequency: HabitFrequency;
  icon?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "main";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "BOSS";
  xpReward: number;
  goldReward: number;
  status: "available" | "in_progress" | "completed";
  deadline?: string;
  progress: number;
  maxProgress: number;
  attributeType?: AttributeType;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  progress: number; // 0 - 100
  totalQuests: number;
  completedQuests: number;
  rewardXp: number;
  rewardBadge: string;
  status: "active" | "completed" | "locked";
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  costGold: number;
  category: "real_world" | "in_game" | "avatar_cosmetic";
  icon: string;
  claimed: boolean;
}
