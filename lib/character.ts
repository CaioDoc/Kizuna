import { AttributeType } from "@/types";
import { ATTRIBUTES_CONFIG } from "./attributes";

export interface CharacterClassInfo {
  className: string;
  subTitle: string;
  dominantAttribute: AttributeType;
  color: string;
}

export function calculateCharacterClass(stats: Record<AttributeType, { level: number; xp: number }>): CharacterClassInfo {
  let highestAttr: AttributeType = "str";
  let maxLevel = -1;

  const attrKeys: AttributeType[] = ["str", "dex", "int", "wis", "cha", "con"];

  for (const attr of attrKeys) {
    if (stats[attr] && stats[attr].level > maxLevel) {
      maxLevel = stats[attr].level;
      highestAttr = attr;
    }
  }

  if (highestAttr === "str") {
    return { className: "Warrior", subTitle: "Frontline Vanguard", dominantAttribute: "str", color: ATTRIBUTES_CONFIG.str.color };
  }
  if (highestAttr === "dex") {
    return { className: "Rogue", subTitle: "Shadow Stalker", dominantAttribute: "dex", color: ATTRIBUTES_CONFIG.dex.color };
  }
  if (highestAttr === "int") {
    return { className: "Mage", subTitle: "Arcane Archmage", dominantAttribute: "int", color: ATTRIBUTES_CONFIG.int.color };
  }
  if (highestAttr === "wis") {
    return { className: "Monk", subTitle: "Zen Grandmaster", dominantAttribute: "wis", color: ATTRIBUTES_CONFIG.wis.color };
  }
  if (highestAttr === "cha") {
    return { className: "Bard", subTitle: "Celestial Virtuoso", dominantAttribute: "cha", color: ATTRIBUTES_CONFIG.cha.color };
  }
  if (highestAttr === "con") {
    return { className: "Paladin", subTitle: "Aegis Guardian", dominantAttribute: "con", color: ATTRIBUTES_CONFIG.con.color };
  }

  return { className: "Adventurer", subTitle: "Novice Hero", dominantAttribute: "str", color: "#8b5cf6" };
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  { id: "ach-1", title: "First Blood", description: "Complete your very first bounty quest.", icon: "Swords", isUnlocked: true, unlockedAt: "2026-08-01" },
  { id: "ach-2", title: "Centurion", description: "Complete 100 total habit routines & bounties.", icon: "Trophy", isUnlocked: true, unlockedAt: "2026-08-08" },
  { id: "ach-3", title: "Marathon Master", description: "Maintain an unbroken 30-day streak.", icon: "Flame", isUnlocked: false },
  { id: "ach-4", title: "Polymath", description: "Raise all 6 RPG attributes to Level 5 or higher.", icon: "Brain", isUnlocked: true, unlockedAt: "2026-08-10" },
  { id: "ach-5", title: "Epic Hero", description: "Successfully claim victory in 5 Master Campaigns.", icon: "Crown", isUnlocked: false },
  { id: "ach-6", title: "Gold Hoarder", description: "Accumulate 5,000 total Gold coins in your vault.", icon: "Coins", isUnlocked: false },
  { id: "ach-7", title: "Vault Collector", description: "Unlock 10 reward perks from the shop.", icon: "Gift", isUnlocked: true, unlockedAt: "2026-08-11" },
  { id: "ach-8", title: "Grandmaster Ascendant", description: "Reach overall Character Level 20.", icon: "Sparkles", isUnlocked: false },
];
