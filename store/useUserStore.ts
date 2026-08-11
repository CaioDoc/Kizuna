import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { DatabaseUser, AttributeType } from "@/types";

export interface AttributeState {
  level: number;
  xp: number;
}

export interface UserStoreState {
  currentUser: DatabaseUser | null;
  totalLevel: number;
  totalXp: number;
  attributes: Record<AttributeType, AttributeState>;
  streak: { current: number; best: number };
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUser: () => Promise<void>;
  updateUser: (profilePartial: Partial<DatabaseUser>) => Promise<void>;
}

const DEFAULT_USER: DatabaseUser = {
  id: "demo-user-id",
  username: "Ren Amamiya",
  email: "ren@kizuna.app",
  avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=kizuna-hero&backgroundColor=8b5cf6",
  total_level: 12,
  total_xp: 3450,
  str_level: 5,
  str_xp: 120,
  dex_level: 4,
  dex_xp: 90,
  int_level: 8,
  int_xp: 340,
  wis_level: 6,
  wis_xp: 210,
  cha_level: 7,
  cha_xp: 290,
  con_level: 4,
  con_xp: 80,
  current_streak: 7,
  best_streak: 14,
  created_at: new Date().toISOString(),
};

export const useUserStore = create<UserStoreState>((set, get) => ({
  currentUser: DEFAULT_USER,
  totalLevel: DEFAULT_USER.total_level,
  totalXp: DEFAULT_USER.total_xp,
  attributes: {
    str: { level: DEFAULT_USER.str_level, xp: DEFAULT_USER.str_xp },
    dex: { level: DEFAULT_USER.dex_level, xp: DEFAULT_USER.dex_xp },
    int: { level: DEFAULT_USER.int_level, xp: DEFAULT_USER.int_xp },
    wis: { level: DEFAULT_USER.wis_level, xp: DEFAULT_USER.wis_xp },
    cha: { level: DEFAULT_USER.cha_level, xp: DEFAULT_USER.cha_xp },
    con: { level: DEFAULT_USER.con_level, xp: DEFAULT_USER.con_xp },
  },
  streak: { current: DEFAULT_USER.current_streak, best: DEFAULT_USER.best_streak },
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        const u = data as DatabaseUser;
        set({
          currentUser: u,
          totalLevel: u.total_level,
          totalXp: u.total_xp,
          attributes: {
            str: { level: u.str_level, xp: u.str_xp },
            dex: { level: u.dex_level, xp: u.dex_xp },
            int: { level: u.int_level, xp: u.int_xp },
            wis: { level: u.wis_level, xp: u.wis_xp },
            cha: { level: u.cha_level, xp: u.cha_xp },
            con: { level: u.con_level, xp: u.con_xp },
          },
          streak: { current: u.current_streak, best: u.best_streak },
          isLoading: false,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch user";
      set({ error: message, isLoading: false });
    }
  },

  updateUser: async (profilePartial) => {
    const prevUser = get().currentUser;
    if (!prevUser) return;

    const updatedUser = { ...prevUser, ...profilePartial };

    // Optimistic state update
    set({
      currentUser: updatedUser,
      totalLevel: updatedUser.total_level,
      totalXp: updatedUser.total_xp,
      streak: { current: updatedUser.current_streak, best: updatedUser.best_streak },
    });

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update(profilePartial)
        .eq("id", prevUser.id);

      if (error) {
        // Rollback on database failure
        set({ currentUser: prevUser, error: error.message });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update user profile";
      set({ currentUser: prevUser, error: message });
    }
  },
}));
