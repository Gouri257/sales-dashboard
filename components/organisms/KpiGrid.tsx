"use client";

import { KpiCard } from "@/components/molecules/KpiCard";
import type { YearlySalesData } from "@/types/sales";
import { getYearOverYearChange } from "@/lib/sales-data";

interface KpiGridProps {
  current: YearlySalesData;
  previous?: YearlySalesData;
}

export function KpiGrid({ current, previous }: KpiGridProps) {
  const revenueChange = previous
    ? getYearOverYearChange(current.totalRevenue, previous.totalRevenue)
    : current.growthRate;

  const unitsChange = previous
    ? getYearOverYearChange(current.totalUnits, previous.totalUnits)
    : current.growthRate * 0.9;

  const ordersChange = previous
    ? getYearOverYearChange(current.totalOrders, previous.totalOrders)
    : current.growthRate * 0.8;

  const aovChange = previous
    ? getYearOverYearChange(current.avgOrderValue, previous.avgOrderValue)
    : current.growthRate * 0.3;

  const compareLabel = previous ? `vs ${previous.year}` : "YoY Growth";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        label="Total Revenue"
        value={current.totalRevenue}
        format="currency"
        change={revenueChange}
        changeLabel={compareLabel}
        icon="dollar"
        color="accent"
        animationDelay={0}
      />
      <KpiCard
        label="Units Sold"
        value={current.totalUnits}
        format="number"
        change={unitsChange}
        changeLabel={compareLabel}
        icon="package"
        color="emerald"
        animationDelay={75}
      />
      <KpiCard
        label="Total Orders"
        value={current.totalOrders}
        format="number"
        change={ordersChange}
        changeLabel={compareLabel}
        icon="cart"
        color="sapphire"
        animationDelay={150}
      />
      <KpiCard
        label="Avg. Order Value"
        value={current.avgOrderValue}
        format="currency"
        change={aovChange}
        changeLabel={compareLabel}
        icon="trend"
        color="default"
        animationDelay={225}
      />
    </div>
  );
}
