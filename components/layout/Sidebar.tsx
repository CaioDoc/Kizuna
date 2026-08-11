"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Swords,
  Trophy,
  Gift,
  Calendar as CalendarIcon,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Habits", href: "/habits", icon: CheckSquare },
  { name: "Quests", href: "/quests", icon: Swords },
  { name: "Epics", href: "/epics", icon: Trophy },
  { name: "Rewards", href: "/rewards", icon: Gift },
  { name: "Calendar", href: "/calendar", icon: CalendarIcon },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative sticky top-16 h-[calc(100vh-4rem)] glass-panel border-r border-[#1f1f2e] transition-all duration-300 z-30 flex flex-col justify-between p-3",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#12121a] border border-[#8b5cf6]/40 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#8b5cf6] transition-all z-40"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Items */}
      <nav className="space-y-1.5 mt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#8b5cf6]/20 to-[#06b6d4]/10 text-white font-semibold border border-[#8b5cf6]/30 shadow-lg glow-purple"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#12121a] hover:border hover:border-[#1f1f2e]"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-[#8b5cf6]" : "text-gray-400 group-hover:text-[#06b6d4]"
                )}
              />

              {!collapsed && (
                <span className="truncate tracking-wide">{item.name}</span>
              )}

              {/* Glowing active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute right-2 w-1.5 h-6 bg-gradient-to-b from-[#8b5cf6] to-[#06b6d4] rounded-full shadow-[0_0_8px_#8b5cf6]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Anime Status Card (Shown when expanded) */}
      {!collapsed && (
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#12121a] to-[#1a1a2e] border border-[#8b5cf6]/20 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-xs font-bold text-gray-200">Daily Quest Bonus</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            Complete 3 habits today to earn +150 XP & rare badge.
          </p>
        </div>
      )}
    </aside>
  );
}
