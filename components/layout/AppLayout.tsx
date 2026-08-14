"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col selection:bg-[#8b5cf6] selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar (Desktop vertical + Mobile bottom bar) */}
        <Sidebar />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
