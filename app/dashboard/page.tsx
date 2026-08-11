"use client";

import React from "react";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { useUserStore } from "@/store/useUserStore";
import { WelcomeWidget } from "@/components/dashboard/WelcomeWidget";
import { TodayBountiesWidget } from "@/components/dashboard/TodayBountiesWidget";
import { HabitStreaksWidget } from "@/components/dashboard/HabitStreaksWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { ProgressOverviewWidget } from "@/components/dashboard/ProgressOverviewWidget";
import { StatsAnalyticsWidget } from "@/components/dashboard/StatsAnalyticsWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";

export default function DashboardPage() {
  const tasks = useEntitiesStore((state) => state.tasks);
  const habits = useEntitiesStore((state) => state.habits);
  const epics = useEntitiesStore((state) => state.epics);
  const quests = useEntitiesStore((state) => state.quests);
  const attributes = useUserStore((state) => state.attributes);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner Widget (Full Width) */}
      <WelcomeWidget todayTasksCount={tasks.length} />

      {/* Quick Actions Launchpad */}
      <QuickActionsWidget />

      {/* Main Responsive Grid Layout (3 cols on desktop, 2 on tablet, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Priorities & Habit Streaks */}
        <div className="space-y-6">
          <TodayBountiesWidget tasks={tasks} />
          <HabitStreaksWidget habits={habits} />
        </div>

        {/* Column 2: Progress & Activity Log */}
        <div className="space-y-6">
          <ProgressOverviewWidget epics={epics} quests={quests} />
          <RecentActivityWidget />
        </div>

        {/* Column 3: Analytics & Recharts */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <StatsAnalyticsWidget attributes={attributes} />
        </div>
      </div>
    </div>
  );
}
