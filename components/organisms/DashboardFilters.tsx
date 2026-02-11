"use client";

import { YearSelector } from "@/components/molecules/YearSelector";
import { RevenueThresholdFilter } from "@/components/molecules/RevenueThresholdFilter";
import { Card } from "@/components/atoms/Card";
import type { Year, ChartType } from "@/types/sales";

interface DashboardFiltersProps {
  selectedYears: Year[];
  onYearsChange: (years: Year[]) => void;
  revenueThreshold: number;
  onThresholdChange: (val: number) => void;
}

export function DashboardFilters({
  selectedYears,
  onYearsChange,
  revenueThreshold,
  onThresholdChange,
}: DashboardFiltersProps) {
  return (
    <Card
      variant="bordered"
      padding="sm"
      className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 px-4 py-3"
    >
      <YearSelector selectedYears={selectedYears} onChange={onYearsChange} />
      <div className="w-px h-8 bg-ink-700 hidden sm:block" />
      <RevenueThresholdFilter
        value={revenueThreshold}
        onChange={onThresholdChange}
      />
    </Card>
  );
}
