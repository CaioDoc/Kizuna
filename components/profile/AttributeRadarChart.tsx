"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { AttributeType } from "@/types";
import { ATTRIBUTES_CONFIG } from "@/lib/attributes";

export interface AttributeRadarChartProps {
  stats: Record<AttributeType, { level: number; xp: number }>;
}

export function AttributeRadarChart({ stats }: AttributeRadarChartProps) {
  const radarData = (Object.keys(stats) as AttributeType[]).map((attrKey) => {
    const meta = ATTRIBUTES_CONFIG[attrKey];
    return {
      attribute: meta.fullName,
      shortLabel: meta.label,
      level: stats[attrKey].level,
      fullMark: 20,
    };
  });

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#1f1f2e] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Attribute Hex-Matrix
        </h3>
        <span className="text-[10px] font-mono text-[#8b5cf6]">Radar Analytics</span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#1f1f2e" />
            <PolarAngleAxis dataKey="shortLabel" stroke="#9ca3af" fontSize={12} />
            <PolarRadiusAxis angle={30} domain={[0, 20]} stroke="#4b5563" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12121a",
                borderColor: "#8b5cf6",
                borderRadius: "0.75rem",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Radar
              name="Stat Level"
              dataKey="level"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
