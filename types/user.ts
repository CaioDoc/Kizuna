export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  gold: number;
  streakDays: number;
  stats: {
    strength: number; // Habits completed
    intelligence: number; // Quests completed
    vitality: number; // Health/fitness tasks
    charisma: number; // Social tasks
  };
}
