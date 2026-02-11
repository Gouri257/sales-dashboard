"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { DashboardFilters } from "@/components/organisms/DashboardFilters";
import { KpiGrid } from "@/components/organisms/KpiGrid";
import { RevenueChart } from "@/components/organisms/RevenueChart";
import { CategoryBreakdownChart } from "@/components/organisms/CategoryBreakdownChart";
import { RegionalSalesChart } from "@/components/organisms/RegionalSalesChart";
import { Badge } from "@/components/atoms/Badge";
import type { Year, ChartType, YearlySalesData } from "@/types/sales";
import { Loader2 } from "lucide-react";

export function DashboardTemplate() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [selectedYears, setSelectedYears] = useState<Year[]>([2024, 2023, 2022]);
  const [revenueThreshold, setRevenueThreshold] = useState(0);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [salesData, setSalesData] = useState<YearlySalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── API Fetch ───────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        years: selectedYears.join(","),
        threshold: revenueThreshold.toString(),
      });
      const res = await fetch(`/api/sales?${params}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setSalesData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedYears, revenueThreshold]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Derived data ────────────────────────────────────────────────────────────
  const primaryData = salesData[0];
  const secondaryData = salesData[1];

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      {/* Subtle gradient backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-accent/3 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-sapphire/4 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Filters */}
        <DashboardFilters
          selectedYears={selectedYears}
          onYearsChange={setSelectedYears}
          revenueThreshold={revenueThreshold}
          onThresholdChange={setRevenueThreshold}
        />

        {/* Loading / Error / Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-ink-400 font-mono text-sm">Loading sales data…</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 text-center">
              <p className="text-red-400 font-mono text-sm mb-2">⚠ {error}</p>
              <button
                onClick={fetchData}
                className="text-ink-300 font-mono text-xs underline hover:text-ink-100"
              >
                Retry
              </button>
            </div>
          </div>
        ) : primaryData ? (
          <>
            {/* KPI Grid — primary year */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-ink-400 font-mono text-xs uppercase tracking-widest">
                  Key Metrics
                </h2>
                <Badge variant="default">{primaryData.year}</Badge>
                {revenueThreshold > 0 && (
                  <Badge variant="warning">
                    Filtered ≥ ${revenueThreshold.toLocaleString()}
                  </Badge>
                )}
              </div>
              <KpiGrid current={primaryData} previous={secondaryData} />
            </section>

            {/* Main Revenue Chart */}
            <section>
              <RevenueChart
                data={salesData}
                chartType={chartType}
                onChartTypeChange={setChartType}
              />
            </section>

            {/* Bottom row: category + regional */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CategoryBreakdownChart data={primaryData} />
              <RegionalSalesChart data={salesData} />
            </section>

            {/* Data Attribution */}
            <footer className="pt-4 border-t border-ink-800">
              <p className="text-ink-600 font-mono text-xs text-center">
                Data inspired by{" "}
                <a
                  href="https://www.kaggle.com/datasets/vivek468/superstore-dataset-final"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-500 hover:text-ink-300 underline underline-offset-2 transition-colors"
                >
                  Kaggle Superstore Dataset
                </a>{" "}
                · Built with Next.js 15, Recharts, Tailwind CSS
              </p>
            </footer>
          </>
        ) : null}
      </div>
    </div>
  );
}
