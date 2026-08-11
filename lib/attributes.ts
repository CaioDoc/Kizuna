import { AttributeType } from "@/types";

export interface AttributeMeta {
  key: AttributeType;
  label: string;
  fullName: string;
  color: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  badgeBorder: string;
  iconName: string;
}

export const ATTRIBUTES_CONFIG: Record<AttributeType, AttributeMeta> = {
  str: {
    key: "str",
    label: "STR",
    fullName: "Strength",
    color: "#ef4444",
    borderColor: "border-red-500",
    textColor: "text-red-400",
    bgColor: "bg-red-500/10",
    badgeBorder: "border-red-500/40",
    iconName: "Dumbbell",
  },
  dex: {
    key: "dex",
    label: "DEX",
    fullName: "Dexterity",
    color: "#10b981",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/40",
    iconName: "Zap",
  },
  int: {
    key: "int",
    label: "INT",
    fullName: "Intelligence",
    color: "#06b6d4",
    borderColor: "border-cyan-500",
    textColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/40",
    iconName: "Brain",
  },
  wis: {
    key: "wis",
    label: "WIS",
    fullName: "Wisdom",
    color: "#8b5cf6",
    borderColor: "border-purple-500",
    textColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    badgeBorder: "border-purple-500/40",
    iconName: "BookOpen",
  },
  cha: {
    key: "cha",
    label: "CHA",
    fullName: "Charisma",
    color: "#ec4899",
    borderColor: "border-pink-500",
    textColor: "text-pink-400",
    bgColor: "bg-pink-500/10",
    badgeBorder: "border-pink-500/40",
    iconName: "Sparkles",
  },
  con: {
    key: "con",
    label: "CON",
    fullName: "Constitution",
    color: "#f97316",
    borderColor: "border-orange-500",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    badgeBorder: "border-orange-500/40",
    iconName: "Shield",
  },
};
