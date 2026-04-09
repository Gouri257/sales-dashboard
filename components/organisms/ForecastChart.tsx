"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/sales-data";
import { RAW_DATA_2024 } from "@/lib/sales-data";

// ── Types ──────────────────────────────────────────────────────────────────
interface ForecastMonth {
  month: string;
  monthShort: string;
  revenue: number;
  units: number;
  orders: number;
  isForecast: boolean;
}

interface ForecastData {
  year: number;
  isForecast: boolean;
  generatedAt: string;
  modelMetrics: { mae: number; r2: number };
  totalRevenue: number;
  growthRate: number;
  monthly: ForecastMonth[];
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1521] border border-[#1e2d42] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-[#cdd6f4] font-bold mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="mb-1">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── Metric Badge ───────────────────────────────────────────────────────────
function MetricBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#0d1521] border border-[#1e2d42] rounded-lg px-4 py-3 flex flex-col gap-1">
      <span className="text-[10px] text-[#6b7fa3] uppercase tracking-widest">
        {label}
      </span>
      <span className="text-lg font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ForecastChart() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/forecast")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForecast(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Build combined chart data: 2024 actual + 2025 forecast side by side
  const chartData = forecast
    ? forecast.monthly.map((m, i) => ({
        month:    m.monthShort,
        forecast: m.revenue,
        actual:   RAW_DATA_2024[i] ?? 0,
        upper:    Math.round(m.revenue * 1.08),
        lower:    Math.round(m.revenue * 0.92),
      }))
    : [];

  if (loading) {
    return (
      <div className="bg-[#0d1521] border border-[#1e2d42] rounded-xl p-8 flex items-center justify-center min-h-[320px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#1e2d42] border-t-[#8B5CF6] rounded-full animate-spin" />
          <span className="text-[#6b7fa3] text-sm">Loading ML forecast...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0d1521] border border-red-900/40 rounded-xl p-6">
        <p className="text-red-400 font-bold mb-1">⚠ Forecast unavailable</p>
        <p className="text-[#6b7fa3] text-sm mb-3">{error}</p>
        <code className="text-xs bg-[#070d14] text-[#8B5CF6] px-3 py-2 rounded block">
          cd ml &amp;&amp; pip install -r requirements.txt &amp;&amp; python pipeline.py
        </code>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="bg-[#0d1521] border border-[#1e2d42] rounded-xl p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#e8eaf6] flex items-center gap-2">
            <span className="text-[#8B5CF6]">◈</span>
            2025 Revenue Forecast
            <span className="text-xs bg-[#8B5CF620] text-[#8B5CF6] border border-[#8B5CF640] px-2 py-0.5 rounded-full ml-1">
              ML Model
            </span>
          </h2>
          <p className="text-[#6b7fa3] text-xs mt-1">
            Linear Regression · scikit-learn · Generated{" "}
            {new Date(forecast.generatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Model metrics */}
        <div className="flex gap-3 flex-wrap">
          <MetricBadge
            label="R² Score"
            value={forecast.modelMetrics.r2.toFixed(3)}
            color="#39d353"
          />
          <MetricBadge
            label="MAE"
            value={formatCurrency(forecast.modelMetrics.mae)}
            color="#fbbf24"
          />
          <MetricBadge
            label="Predicted Total"
            value={formatCurrency(forecast.totalRevenue)}
            color="#8B5CF6"
          />
          <MetricBadge
            label="Growth vs 2024"
            value={`+${forecast.growthRate}%`}
            color="#E85D26"
          />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d42" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#6b7fa3", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            tick={{ fill: "#6b7fa3", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6b7fa3", paddingTop: 12 }}
          />

          {/* Confidence band */}
          <Area
            dataKey="upper"
            stroke="none"
            fill="#8B5CF6"
            fillOpacity={0.08}
            name="Upper bound"
            legendType="none"
          />
          <Area
            dataKey="lower"
            stroke="none"
            fill="#8B5CF6"
            fillOpacity={0}
            name="Lower bound"
            legendType="none"
          />

          {/* 2024 actual bars */}
          <Bar
            dataKey="actual"
            name="2024 Actual"
            fill="#E85D26"
            opacity={0.7}
            radius={[3, 3, 0, 0]}
            barSize={14}
          />

          {/* 2025 forecast bars */}
          <Bar
            dataKey="forecast"
            name="2025 Forecast"
            fill="#8B5CF6"
            opacity={0.85}
            radius={[3, 3, 0, 0]}
            barSize={14}
          />

          {/* Forecast trend line */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: "#8B5CF6", r: 3 }}
            name="Forecast trend"
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Monthly table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e2d42]">
              {["Month", "2024 Actual", "2025 Forecast", "Growth"].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3 text-[#6b7fa3] uppercase tracking-wider font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forecast.monthly.map((m, i) => {
              const actual = RAW_DATA_2024[i] ?? 0;
              const growth = ((m.revenue - actual) / actual) * 100;
              return (
                <tr
                  key={m.month}
                  className="border-b border-[#0f1520] hover:bg-[#111927] transition-colors"
                >
                  <td className="py-2 px-3 text-[#cdd6f4]">{m.month}</td>
                  <td className="py-2 px-3 text-[#E85D26]">
                    {formatCurrency(actual)}
                  </td>
                  <td className="py-2 px-3 text-[#8B5CF6] font-semibold">
                    {formatCurrency(m.revenue)}
                  </td>
                  <td
                    className="py-2 px-3 font-semibold"
                    style={{ color: growth >= 0 ? "#39d353" : "#ef4444" }}
                  >
                    {growth >= 0 ? "+" : ""}
                    {growth.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <p className="text-[10px] text-[#6b7fa3] border-t border-[#1e2d42] pt-3">
        Model trained on 2022–2024 data (36 months) using Linear Regression with cyclical month encoding,
        lag features, and rolling averages. Confidence band: ±8% based on test MAE.
      </p>
    </div>
  );
}
