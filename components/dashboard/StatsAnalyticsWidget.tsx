"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { BarChart3, Lightbulb } from "lucide-react";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";
import { AttributeType } from "@/types";

const DAILY_XP_DATA = [
  { day: "Aug 1", xp: 120 },
  { day: "Aug 2", xp: 250 },
  { day: "Aug 3", xp: 180 },
  { day: "Aug 4", xp: 340 },
  { day: "Aug 5", xp: 290 },
  { day: "Aug 6", xp: 450 },
  { day: "Aug 7", xp: 520 },
  { day: "Aug 8", xp: 380 },
  { day: "Aug 9", xp: 480 },
  { day: "Aug 10", xp: 610 },
  { day: "Aug 11", xp: 750 },
];

export interface StatsAnalyticsWidgetProps {
  attributes: Record<AttributeType, { level: number; xp: number }>;
}

export function StatsAnalyticsWidget({ attributes }: StatsAnalyticsWidgetProps) {
  const barData = (Object.keys(attributes) as AttributeType[]).map((attrKey) => ({
    name: ATTRIBUTES_CONFIG[attrKey].label,
    level: attributes[attrKey].level,
    fill: ATTRIBUTES_CONFIG[attrKey].color,
  }));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#06b6d4]" />
          XP Gain & Attribute Analytics
        </h3>
        <span className="text-[10px] font-mono text-[#8b5cf6]">Last 30 Days</span>
      </div>

      {/* 30-Day XP Gain Area Chart */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Daily XP Accumulation</span>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DAILY_XP_DATA}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12121a",
                  borderColor: "#8b5cf6",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="xp" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorXp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attribute Breakdown Bar Chart */}
      <div className="space-y-2 pt-2 border-t border-[#1f1f2e]">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Attribute Level Comparison</span>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12121a",
                  borderColor: "#06b6d4",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="level" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Insights Callout */}
      <div className="p-3.5 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-white font-bold">Productivity Insight:</strong> You are most productive on Tuesdays! Finishing 3 bounties on Tuesday will unlock your next Level Up.
        </p>
      </div>
    </div>
  );
}
