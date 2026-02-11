"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardSubtitle } from "@/components/atoms/Card";
import { TrendIndicator } from "@/components/atoms/TrendIndicator";
import { formatCurrency } from "@/lib/sales-data";
import { YEAR_COLORS } from "@/lib/sales-data";
import type { YearlySalesData } from "@/types/sales";

interface RegionalSalesChartProps {
  data: YearlySalesData[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink-800 border border-ink-600 rounded-xl p-3 shadow-2xl text-xs font-mono">
      <p className="text-ink-300 mb-2 uppercase tracking-wider">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="text-ink-400">{p.dataKey}</span>
          <span className="text-ink-100 font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function RegionalSalesChart({ data }: RegionalSalesChartProps) {
  // Build unified region dataset for radar
  const regions = ["West", "East", "Central", "South"];
  const radarData = regions.map((region) => {
    const row: Record<string, string | number> = { region };
    for (const d of data) {
      const match = d.regions.find((r) => r.region === region);
      row[String(d.year)] = match?.revenue ?? 0;
    }
    return row;
  });

  // Latest year for the region table
  const latest = data[0];

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Regional Performance</CardTitle>
          <CardSubtitle className="mt-1">Revenue distribution by region</CardSubtitle>
        </div>
      </CardHeader>

      {/* Region table */}
      <div className="space-y-2 mb-5">
        {latest.regions.map((region) => (
          <div
            key={region.region}
            className="flex items-center justify-between py-2 border-b border-ink-700/50 last:border-0"
          >
            <span className="text-ink-300 font-mono text-xs">{region.region}</span>
            <div className="flex items-center gap-3">
              <span className="text-ink-100 font-mono text-sm">
                {formatCurrency(region.revenue)}
              </span>
              <TrendIndicator value={region.growth} />
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#252529" />
            <PolarAngleAxis
              dataKey="region"
              tick={{
                fill: "#6B6B7A",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {data.map((d) => (
              <Radar
                key={d.year}
                name={String(d.year)}
                dataKey={String(d.year)}
                stroke={YEAR_COLORS[d.year]}
                fill={YEAR_COLORS[d.year]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
