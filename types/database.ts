export type EpicStatus = "active" | "completed" | "abandoned";
export type QuestStatus = "active" | "completed" | "abandoned";
export type TaskStatus = "pending" | "in_progress" | "completed";
export type HabitFrequency = "daily" | "weekly" | "monthly" | "custom";
export type AttributeType = "str" | "dex" | "int" | "wis" | "cha" | "con";
export type EntityType = "epic" | "quest" | "task" | "habit" | "reward";
export type ActionType = "created" | "completed" | "redeemed" | "archived";
export type MoodType = "amazing" | "good" | "neutral" | "bad" | "terrible";

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  total_level: number;
  total_xp: number;
  str_level: number;
  str_xp: number;
  dex_level: number;
  dex_xp: number;
  int_level: number;
  int_xp: number;
  wis_level: number;
  wis_xp: number;
  cha_level: number;
  cha_xp: number;
  con_level: number;
  con_xp: number;
  current_streak: number;
  best_streak: number;
  created_at: string;
}

export interface DatabaseEpic {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: EpicStatus;
  target_date: string | null;
  image_url: string | null;
  created_at: string;
}

export interface DatabaseQuest {
  id: string;
  epic_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  status: QuestStatus;
  reward_points: number;
  attribute_type: AttributeType;
  attribute_xp: number;
  target_date: string | null;
  image_url: string | null;
  created_at: string;
}

export interface DatabaseTask {
  id: string;
  quest_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  reward_points: number;
  attribute_type: AttributeType;
  attribute_xp: number;
  due_date: string | null;
  image_url: string | null;
  created_at: string;
}

export interface DatabaseHabit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reward_points: number;
  attribute_type: AttributeType;
  attribute_xp: number;
  frequency: HabitFrequency;
  repeat_days?: string[]; // e.g. ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  is_active: boolean;
  image_url: string | null;
  created_at: string;
}

export interface DatabaseReward {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cost_points: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseActivityLog {
  id: string;
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  action_type: ActionType;
  points_change: number;
  attribute_xp_gained: number;
  attribute_type: AttributeType | null;
  created_at: string;
}

export interface DatabaseJournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  content: string;
  mood: MoodType;
  xp_bonus: number;
  created_at: string;
}
