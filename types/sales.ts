// ─── Sales Data Types ────────────────────────────────────────────────────────

export type Year = 2022 | 2023 | 2024;

export interface MonthlySale {
  month: string;
  monthShort: string;
  revenue: number;
  units: number;
  orders: number;
}

export interface CategorySale {
  category: string;
  revenue: number;
  units: number;
  color: string;
}

export interface RegionSale {
  region: string;
  revenue: number;
  growth: number;
}

export interface YearlySalesData {
  year: Year;
  totalRevenue: number;
  totalUnits: number;
  totalOrders: number;
  avgOrderValue: number;
  growthRate: number;
  monthly: MonthlySale[];
  categories: CategorySale[];
  regions: RegionSale[];
}

export interface SalesApiResponse {
  data: YearlySalesData[];
  lastUpdated: string;
}

// ─── Chart Types ─────────────────────────────────────────────────────────────

export type ChartType = "bar" | "line" | "area" | "pie";

export interface ChartConfig {
  type: ChartType;
  title: string;
  dataKey: string;
  color: string;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface FilterState {
  selectedYears: Year[];
  revenueThreshold: number;
  chartType: ChartType;
  selectedCategory: string | null;
  selectedRegion: string | null;
}

// ─── KPI Types ────────────────────────────────────────────────────────────────

export interface KpiCard {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change: number;
  changeLabel: string;
  icon: string;
  color: "accent" | "emerald" | "sapphire" | "default";
}
