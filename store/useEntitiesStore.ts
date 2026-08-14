import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import {
  DatabaseEpic,
  DatabaseQuest,
  DatabaseTask,
  DatabaseHabit,
  DatabaseReward,
  EntityType,
} from "@/types";

export interface EntitiesStoreState {
  epics: DatabaseEpic[];
  quests: DatabaseQuest[];
  tasks: DatabaseTask[];
  habits: DatabaseHabit[];
  rewards: DatabaseReward[];
  isLoading: boolean;
  error: string | null;

  // Fetch Actions
  fetchEpics: () => Promise<void>;
  fetchQuests: (questId?: string) => Promise<void>;
  fetchTasks: (questId?: string) => Promise<void>;
  fetchHabits: () => Promise<void>;
  fetchRewards: () => Promise<void>;

  // Mutation Actions (Optimistic & Local Persistent)
  createEntity: <T = Record<string, unknown>>(type: EntityType, data: T) => Promise<void>;
  updateEntity: <T = Record<string, unknown>>(type: EntityType, id: string, data: Partial<T>) => Promise<void>;
  deleteEntity: (type: EntityType, id: string) => Promise<void>;
}

// Initial Fallback Mock Data
const INITIAL_EPICS: DatabaseEpic[] = [
  {
    id: "epic-1",
    user_id: "demo-user-id",
    title: "Cyberpunk Full-Stack Ascendant",
    description: "Complete 50 coding quests, master Next.js, and deploy production apps.",
    status: "active",
    target_date: "2026-12-31",
    image_url: null,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_QUESTS: DatabaseQuest[] = [
  {
    id: "quest-1",
    epic_id: "epic-1",
    user_id: "demo-user-id",
    title: "Defeat the Refactoring Beast",
    description: "Refactor legacy codebase module with full unit test coverage.",
    status: "active",
    reward_points: 150,
    attribute_type: "int",
    attribute_xp: 300,
    target_date: "2026-08-20",
    image_url: null,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_TASKS: DatabaseTask[] = [
  {
    id: "task-1",
    quest_id: "quest-1",
    user_id: "demo-user-id",
    title: "Audit legacy API endpoints",
    description: null,
    status: "pending",
    reward_points: 20,
    attribute_type: "int",
    attribute_xp: 15,
    due_date: "2026-08-15",
    image_url: null,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_HABITS: DatabaseHabit[] = [
  {
    id: "habit-1",
    user_id: "demo-user-id",
    title: "Morning Workout / Stretches",
    description: "15 minutes of cardio & stretching",
    reward_points: 30,
    attribute_type: "str",
    attribute_xp: 50,
    frequency: "daily",
    repeat_days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    is_active: true,
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "habit-2",
    user_id: "demo-user-id",
    title: "Read 20 pages of Tech / Manga",
    description: "Daily reading routine",
    reward_points: 25,
    attribute_type: "int",
    attribute_xp: 75,
    frequency: "daily",
    repeat_days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    is_active: true,
    image_url: null,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_REWARDS: DatabaseReward[] = [
  {
    id: "reward-1",
    user_id: "demo-user-id",
    title: "Cheat Day Ramen Treat",
    description: "Enjoy a high-tier ramen bowl with extra chashu.",
    cost_points: 500,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const TABLE_MAP: Record<EntityType, string> = {
  epic: "epics",
  quest: "quests",
  task: "tasks",
  habit: "habits",
  reward: "rewards",
};

export const useEntitiesStore = create<EntitiesStoreState>()(
  persist(
    (set) => ({
      epics: INITIAL_EPICS,
      quests: INITIAL_QUESTS,
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      rewards: INITIAL_REWARDS,
      isLoading: false,
      error: null,

      fetchEpics: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.from("epics").select("*");
          if (!error && data && data.length > 0) {
            set({ epics: data as DatabaseEpic[] });
          }
        } catch {
          // Preserve local storage state if remote query fails
        } finally {
          set({ isLoading: false });
        }
      },

      fetchQuests: async (questId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          let query = supabase.from("quests").select("*");
          if (questId) query = query.eq("id", questId);
          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            set({ quests: data as DatabaseQuest[] });
          }
        } catch {
          // Preserve local storage state
        } finally {
          set({ isLoading: false });
        }
      },

      fetchTasks: async (questId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          let query = supabase.from("tasks").select("*");
          if (questId) query = query.eq("quest_id", questId);
          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            set({ tasks: data as DatabaseTask[] });
          }
        } catch {
          // Preserve local storage state
        } finally {
          set({ isLoading: false });
        }
      },

      fetchHabits: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.from("habits").select("*");
          if (!error && data && data.length > 0) {
            set({ habits: data as DatabaseHabit[] });
          }
        } catch {
          // Preserve local storage state
        } finally {
          set({ isLoading: false });
        }
      },

      fetchRewards: async () => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.from("rewards").select("*");
          if (!error && data && data.length > 0) {
            set({ rewards: data as DatabaseReward[] });
          }
        } catch {
          // Preserve local storage state
        } finally {
          set({ isLoading: false });
        }
      },

      createEntity: async (type, data) => {
        const table = TABLE_MAP[type];
        const newRecord = {
          id: (data as { id?: string }).id || `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...data,
        };

        // Persistent State Update
        if (type === "epic") set((s) => ({ epics: [newRecord as unknown as DatabaseEpic, ...s.epics] }));
        if (type === "quest") set((s) => ({ quests: [newRecord as unknown as DatabaseQuest, ...s.quests] }));
        if (type === "task") set((s) => ({ tasks: [newRecord as unknown as DatabaseTask, ...s.tasks] }));
        if (type === "habit") set((s) => ({ habits: [newRecord as unknown as DatabaseHabit, ...s.habits] }));
        if (type === "reward") set((s) => ({ rewards: [newRecord as unknown as DatabaseReward, ...s.rewards] }));

        try {
          const supabase = createClient();
          await supabase.from(table).insert(data as Record<string, unknown>);
        } catch {
          // Keep local state persisted in localStorage
        }
      },

      updateEntity: async (type, id, data) => {
        const table = TABLE_MAP[type];

        // Persistent State Update
        if (type === "epic") set((s) => ({ epics: s.epics.map((e) => (e.id === id ? { ...e, ...data } : e)) }));
        if (type === "quest") set((s) => ({ quests: s.quests.map((q) => (q.id === id ? { ...q, ...data } : q)) }));
        if (type === "task") set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) }));
        if (type === "habit") set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...data } : h)) }));
        if (type === "reward") set((s) => ({ rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...data } : r)) }));

        try {
          const supabase = createClient();
          await supabase.from(table).update(data as Record<string, unknown>).eq("id", id);
        } catch {
          // Keep local state persisted
        }
      },

      deleteEntity: async (type, id) => {
        const table = TABLE_MAP[type];

        // Persistent State Update
        if (type === "epic") set((s) => ({ epics: s.epics.filter((e) => e.id !== id) }));
        if (type === "quest") set((s) => ({ quests: s.quests.filter((q) => q.id !== id) }));
        if (type === "task") set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        if (type === "habit") set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
        if (type === "reward") set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) }));

        try {
          const supabase = createClient();
          await supabase.from(table).delete().eq("id", id);
        } catch {
          // Keep local state persisted
        }
      },
    }),
    {
      name: "kizuna-entities-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
