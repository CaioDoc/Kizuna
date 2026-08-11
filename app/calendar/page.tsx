"use client";

import React, { useState, useEffect, useCallback } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { useEntitiesStore } from "@/store/useEntitiesStore";
import { CalendarHeader, CalendarViewMode } from "@/components/calendar/CalendarHeader";
import { MonthCalendarView } from "@/components/calendar/MonthCalendarView";
import { WeekCalendarView } from "@/components/calendar/WeekCalendarView";
import { DayCalendarView } from "@/components/calendar/DayCalendarView";
import { AgendaSidebar } from "@/components/calendar/AgendaSidebar";
import { CreateEventModal } from "@/components/calendar/CreateEventModal";

export default function CalendarPage() {
  const tasks = useEntitiesStore((state) => state.tasks);
  const habits = useEntitiesStore((state) => state.habits);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else if (viewMode === "week") setCurrentDate((prev) => subWeeks(prev, 1));
    else setCurrentDate((prev) => subDays(prev, 1));
  }, [viewMode]);

  const handleNext = useCallback(() => {
    if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else if (viewMode === "week") setCurrentDate((prev) => addWeeks(prev, 1));
    else setCurrentDate((prev) => addDays(prev, 1));
  }, [viewMode]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const handleNewEvent = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  // Global Keyboard Shortcuts Listener ('T', 'N', Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in an input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        handleToday();
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleNewEvent();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToday, handleNewEvent, handlePrev, handleNext]);

  return (
    <div className="space-y-6">
      {/* Header with Navigation Controls & Shortcuts Info */}
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onNewEvent={handleNewEvent}
      />

      {/* Main Content Layout: Main Calendar View + Right Agenda Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Selected View */}
        <div className="lg:col-span-2 space-y-6">
          {viewMode === "month" && (
            <MonthCalendarView
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
            />
          )}

          {viewMode === "week" && (
            <WeekCalendarView
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
            />
          )}

          {viewMode === "day" && (
            <DayCalendarView
              selectedDate={selectedDate}
              tasks={tasks}
              habits={habits}
            />
          )}
        </div>

        {/* Right 1 Column: Agenda Sidebar */}
        <div className="lg:col-span-1">
          <AgendaSidebar
            selectedDate={selectedDate}
            tasks={tasks}
            habits={habits}
            onNewEvent={handleNewEvent}
          />
        </div>
      </div>

      {/* Event Creation Modal */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}
