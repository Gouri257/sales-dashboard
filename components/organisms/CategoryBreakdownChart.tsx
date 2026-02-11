"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardSubtitle } from "@/components/atoms/Card";
import { formatCurrency } from "@/lib/sales-data";
import type { YearlySalesData } from "@/types/sales";

interface CategoryBreakdownChartProps {
  data: YearlySalesData;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-xl p-3 shadow-2xl shadow-ink-950/60">
      <p className="text-ink-300 font-mono text-xs mb-1 uppercase">{label}</p>
      <p className="text-ink-100 font-mono text-sm font-medium">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const axisStyle = {
    fill: "#6B6B7A",
    fontSize: 11,
    fontFamily: "JetBrains Mono, monospace",
  };

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <div>
          <CardTitle>Revenue by Category</CardTitle>
          <CardSubtitle className="mt-1">{data.year} · All Categories</CardSubtitle>
        </div>
      </CardHeader>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.categories}
            layout="vertical"
            barSize={16}
            margin={{ left: 8 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#252529"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              width={88}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#1A1A1E" }}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {data.categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
