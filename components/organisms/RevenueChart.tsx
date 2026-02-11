"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardSubtitle } from "@/components/atoms/Card";
import { ChartTypeSelector } from "@/components/molecules/ChartTypeSelector";
import { formatCurrency, YEAR_COLORS } from "@/lib/sales-data";
import type { MonthlySale, ChartType, YearlySalesData } from "@/types/sales";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-xl p-3 shadow-2xl shadow-ink-950/60 min-w-[160px]">
      <p className="text-ink-300 font-mono text-xs mb-2 uppercase tracking-wider">
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-ink-400 font-mono text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="text-ink-100 font-mono text-sm font-medium">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Pie custom tooltip ───────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-ink-800 border border-ink-600 rounded-xl p-3 shadow-2xl">
      <p className="text-ink-300 font-mono text-xs mb-1">{item.name}</p>
      <p className="text-ink-100 font-mono text-sm font-medium">
        {formatCurrency(item.value)}
      </p>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

interface RevenueChartProps {
  data: YearlySalesData[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

function buildMonthlyComparison(datasets: YearlySalesData[]) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return months.map((month) => {
    const row: Record<string, string | number> = { month };
    for (const dataset of datasets) {
      const match = dataset.monthly.find((m: MonthlySale) => m.monthShort === month);
      row[String(dataset.year)] = match?.revenue ?? 0;
    }
    return row;
  });
}

function buildPieData(datasets: YearlySalesData[]) {
  // Use all years in pie, sum by month across years
  return datasets.map((d) => ({
    name: String(d.year),
    value: d.totalRevenue,
    fill: YEAR_COLORS[d.year],
  }));
}

export function RevenueChart({
  data,
  chartType,
  onChartTypeChange,
}: RevenueChartProps) {
  const chartData = chartType === "pie"
    ? buildPieData(data)
    : buildMonthlyComparison(data);

  const axisStyle = {
    fill: "#6B6B7A",
    fontSize: 11,
    fontFamily: "JetBrains Mono, monospace",
  };

  const gridStyle = { stroke: "#252529", strokeDasharray: "3 3" };

  return (
    <Card variant="elevated" padding="lg" className="animate-fade-in">
      <CardHeader>
        <div>
          <CardTitle>Monthly Revenue Comparison</CardTitle>
          <CardSubtitle className="mt-1">
            {data.map((d) => d.year).join(" · ")} · Revenue by Month
          </CardSubtitle>
        </div>
        <ChartTypeSelector value={chartType} onChange={onChartTypeChange} />
      </CardHeader>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData} barSize={chartData.length > 8 ? 8 : 14}>
              <CartesianGrid vertical={false} stroke={gridStyle.stroke} strokeDasharray={gridStyle.strokeDasharray} />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v)}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1A1A1E" }} />
              <Legend
                wrapperStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#9B9BAA" }}
              />
              {data.map((d) => (
                <Bar key={d.year} dataKey={String(d.year)} fill={YEAR_COLORS[d.year]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} stroke={gridStyle.stroke} strokeDasharray={gridStyle.strokeDasharray} />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v)}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#9B9BAA" }} />
              {data.map((d) => (
                <Line
                  key={d.year}
                  type="monotone"
                  dataKey={String(d.year)}
                  stroke={YEAR_COLORS[d.year]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: YEAR_COLORS[d.year] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          ) : chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                {data.map((d) => (
                  <linearGradient key={d.year} id={`grad-${d.year}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={YEAR_COLORS[d.year]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={YEAR_COLORS[d.year]} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke={gridStyle.stroke} strokeDasharray={gridStyle.strokeDasharray} />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v)}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#9B9BAA" }} />
              {data.map((d) => (
                <Area
                  key={d.year}
                  type="monotone"
                  dataKey={String(d.year)}
                  stroke={YEAR_COLORS[d.year]}
                  strokeWidth={2}
                  fill={`url(#grad-${d.year})`}
                />
              ))}
            </AreaChart>
          ) : (
            /* Pie */
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {(chartData as { name: string; value: number; fill: string }[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "#9B9BAA" }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
