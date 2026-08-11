import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile, Habit, Quest, Epic, Reward } from "@/types";

interface GameState {
  user: UserProfile;
  habits: Habit[];
  quests: Quest[];
  epics: Epic[];
  rewards: Reward[];
  
  // Actions
  addXp: (amount: number) => void;
  addGold: (amount: number) => void;
  toggleHabit: (id: string) => void;
  completeQuest: (id: string) => void;
  claimReward: (id: string) => boolean;
  updateUserProfile: (profilePartial: Partial<UserProfile>) => void;
}

const INITIAL_USER: UserProfile = {
  id: "user-1",
  name: "Ren Amamiya",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=kizuna-hero&backgroundColor=8b5cf6",
  title: "Shadow Stalker • Lv. 12",
  level: 12,
  currentXp: 3450,
  nextLevelXp: 5000,
  gold: 850,
  streakDays: 7,
  stats: {
    strength: 24,
    intelligence: 42,
    vitality: 18,
    charisma: 31,
  },
};

const INITIAL_HABITS: Habit[] = [
  { id: "h1", title: "Morning Workout / Stretches", category: "Vitality", streak: 5, completed: false, xpReward: 50, frequency: "daily", icon: "Dumbbell" },
  { id: "h2", title: "Read 20 pages of Light Novel / Tech book", category: "Intelligence", streak: 12, completed: true, xpReward: 75, frequency: "daily", icon: "BookOpen" },
  { id: "h3", title: "Code 1 hour on Personal Project", category: "Intelligence", streak: 7, completed: false, xpReward: 100, frequency: "daily", icon: "Code" },
  { id: "h4", title: "Drink 2L Water", category: "Vitality", streak: 3, completed: true, xpReward: 30, frequency: "daily", icon: "Droplets" },
];

const INITIAL_QUESTS: Quest[] = [
  {
    id: "q1",
    title: "Defeat the Refactoring Beast",
    description: "Refactor legacy codebase module with full unit test coverage.",
    category: "daily",
    difficulty: "HARD",
    xpReward: 300,
    goldReward: 150,
    status: "in_progress",
    progress: 2,
    maxProgress: 3,
  },
  {
    id: "q2",
    title: "Master Next.js 14 App Router",
    description: "Build 3 clean layout routes with React Server Components.",
    category: "weekly",
    difficulty: "MEDIUM",
    xpReward: 500,
    goldReward: 250,
    status: "in_progress",
    progress: 1,
    maxProgress: 3,
  },
  {
    id: "q3",
    title: "Morning Meditation Focus",
    description: "Complete 10 minutes of uninterrupted mindfulness session.",
    category: "daily",
    difficulty: "EASY",
    xpReward: 100,
    goldReward: 50,
    status: "completed",
    progress: 1,
    maxProgress: 1,
  },
];

const INITIAL_EPICS: Epic[] = [
  {
    id: "e1",
    title: "Cyberpunk Full-Stack Ascendant",
    description: "Complete 50 coding quests, master Next.js, and deploy 3 production apps.",
    progress: 65,
    totalQuests: 20,
    completedQuests: 13,
    rewardXp: 5000,
    rewardBadge: "Grandmaster Hacker",
    status: "active",
  },
  {
    id: "e2",
    title: "Iron Physique Awakening",
    description: "Maintain a 30-day streak of daily training and healthy nutrition.",
    progress: 40,
    totalQuests: 30,
    completedQuests: 12,
    rewardXp: 4000,
    rewardBadge: "Titan Body",
    status: "active",
  },
];

const INITIAL_REWARDS: Reward[] = [
  { id: "r1", title: "Cheat Day Ramen Treat", description: "Enjoy a high-tier ramen bowl with extra chashu without guilt.", costGold: 500, category: "real_world", icon: "Utensils", claimed: false },
  { id: "r2", title: "Cyber-Neon Skin Theme", description: "Unlock custom glowing neon profile aura in Kizuna.", costGold: 1000, category: "avatar_cosmetic", icon: "Sparkles", claimed: false },
  { id: "r3", title: "1 Hour Gaming Break", description: "Uninterrupted gaming session after finishing main quests.", costGold: 300, category: "real_world", icon: "Gamepad2", claimed: false },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      habits: INITIAL_HABITS,
      quests: INITIAL_QUESTS,
      epics: INITIAL_EPICS,
      rewards: INITIAL_REWARDS,

      addXp: (amount: number) => {
        set((state) => {
          let { currentXp, level, nextLevelXp } = state.user;
          currentXp += amount;
          while (currentXp >= nextLevelXp) {
            currentXp -= nextLevelXp;
            level += 1;
            nextLevelXp = Math.floor(nextLevelXp * 1.25);
          }
          return {
            user: {
              ...state.user,
              currentXp,
              level,
              nextLevelXp,
            },
          };
        });
      },

      addGold: (amount: number) => {
        set((state) => ({
          user: { ...state.user, gold: state.user.gold + amount },
        }));
      },

      toggleHabit: (id: string) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return;

        const isNowCompleted = !habit.completed;
        const xpDelta = isNowCompleted ? habit.xpReward : -habit.xpReward;

        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completed: isNowCompleted,
                  streak: isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
                }
              : h
          ),
        }));

        get().addXp(xpDelta);
      },

      completeQuest: (id: string) => {
        const quest = get().quests.find((q) => q.id === id);
        if (!quest || quest.status === "completed") return;

        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === id ? { ...q, status: "completed", progress: q.maxProgress } : q
          ),
        }));

        get().addXp(quest.xpReward);
        get().addGold(quest.goldReward);
      },

      claimReward: (id: string) => {
        const reward = get().rewards.find((r) => r.id === id);
        const { user } = get();

        if (!reward || reward.claimed || user.gold < reward.costGold) {
          return false;
        }

        set((state) => ({
          user: { ...state.user, gold: state.user.gold - reward.costGold },
          rewards: state.rewards.map((r) =>
            r.id === id ? { ...r, claimed: true } : r
          ),
        }));

        return true;
      },

      updateUserProfile: (profilePartial) => {
        set((state) => ({
          user: { ...state.user, ...profilePartial },
        }));
      },
    }),
    {
      name: "kizuna-game-storage",
    }
  )
);
