import type { YearlySalesData, Year } from "@/types/sales";

// ─── Mock Data (Inspired by Kaggle's "Superstore Sales Dataset") ─────────────
// Based on publicly available retail sales patterns from Kaggle's
// "Sample - Superstore" and "Global Superstore" datasets.
// Values are approximate real-world retail figures.

export const SALES_DATA: Record<Year, YearlySalesData> = {
  2024: {
    year: 2024,
    totalRevenue: 4_892_417,
    totalUnits: 68_312,
    totalOrders: 19_442,
    avgOrderValue: 251.66,
    growthRate: 14.2,
    monthly: [
      { month: "January",   monthShort: "Jan", revenue: 312_450, units: 4_312, orders: 1_201 },
      { month: "February",  monthShort: "Feb", revenue: 289_300, units: 3_987, orders: 1_102 },
      { month: "March",     monthShort: "Mar", revenue: 378_920, units: 5_241, orders: 1_489 },
      { month: "April",     monthShort: "Apr", revenue: 361_200, units: 4_987, orders: 1_412 },
      { month: "May",       monthShort: "May", revenue: 402_780, units: 5_632, orders: 1_587 },
      { month: "June",      monthShort: "Jun", revenue: 438_560, units: 6_102, orders: 1_734 },
      { month: "July",      monthShort: "Jul", revenue: 421_300, units: 5_876, orders: 1_652 },
      { month: "August",    monthShort: "Aug", revenue: 445_820, units: 6_231, orders: 1_798 },
      { month: "September", monthShort: "Sep", revenue: 467_990, units: 6_512, orders: 1_876 },
      { month: "October",   monthShort: "Oct", revenue: 412_340, units: 5_743, orders: 1_623 },
      { month: "November",  monthShort: "Nov", revenue: 489_210, units: 6_821, orders: 1_943 },
      { month: "December",  monthShort: "Dec", revenue: 472_547, units: 6_868, orders: 2_025 },
    ],
    categories: [
      { category: "Technology",   revenue: 1_768_890, units: 18_421, color: "#3B82F6" },
      { category: "Furniture",    revenue: 1_312_240, units: 19_876, color: "#E85D26" },
      { category: "Office Supp.", revenue:   921_650, units: 21_340, color: "#10B981" },
      { category: "Apparel",      revenue:   564_820, units:  8_675, color: "#8B5CF6" },
      { category: "Electronics",  revenue:   324_817, units:     0,  color: "#F59E0B" },
    ],
    regions: [
      { region: "West",    revenue: 1_634_220, growth: 18.3 },
      { region: "East",    revenue: 1_287_430, growth: 12.7 },
      { region: "Central", revenue:   989_610, growth:  9.4 },
      { region: "South",   revenue:   981_157, growth: 15.1 },
    ],
  },

  2023: {
    year: 2023,
    totalRevenue: 4_283_102,
    totalUnits: 59_874,
    totalOrders: 16_912,
    avgOrderValue: 253.25,
    growthRate: 9.8,
    monthly: [
      { month: "January",   monthShort: "Jan", revenue: 274_200, units: 3_712, orders: 1_054 },
      { month: "February",  monthShort: "Feb", revenue: 251_300, units: 3_421, orders:   978 },
      { month: "March",     monthShort: "Mar", revenue: 331_850, units: 4_563, orders: 1_302 },
      { month: "April",     monthShort: "Apr", revenue: 318_400, units: 4_312, orders: 1_241 },
      { month: "May",       monthShort: "May", revenue: 352_640, units: 4_897, orders: 1_387 },
      { month: "June",      monthShort: "Jun", revenue: 384_120, units: 5_321, orders: 1_512 },
      { month: "July",      monthShort: "Jul", revenue: 368_900, units: 5_102, orders: 1_432 },
      { month: "August",    monthShort: "Aug", revenue: 390_450, units: 5_421, orders: 1_567 },
      { month: "September", monthShort: "Sep", revenue: 408_780, units: 5_687, orders: 1_643 },
      { month: "October",   monthShort: "Oct", revenue: 361_200, units: 5_012, orders: 1_412 },
      { month: "November",  monthShort: "Nov", revenue: 428_760, units: 5_989, orders: 1_712 },
      { month: "December",  monthShort: "Dec", revenue: 412_502, units: 5_437, orders: 1_672 },
    ],
    categories: [
      { category: "Technology",   revenue: 1_541_320, units: 15_893, color: "#3B82F6" },
      { category: "Furniture",    revenue: 1_148_780, units: 17_234, color: "#E85D26" },
      { category: "Office Supp.", revenue:   813_490, units: 18_910, color: "#10B981" },
      { category: "Apparel",      revenue:   497_980, units:  7_837, color: "#8B5CF6" },
      { category: "Electronics",  revenue:   281_532, units:      0, color: "#F59E0B" },
    ],
    regions: [
      { region: "West",    revenue: 1_432_450, growth: 11.2 },
      { region: "East",    revenue: 1_121_870, growth:  8.9 },
      { region: "Central", revenue:   876_340, growth:  6.3 },
      { region: "South",   revenue:   852_442, growth: 12.8 },
    ],
  },

  2022: {
    year: 2022,
    totalRevenue: 3_899_754,
    totalUnits: 52_341,
    totalOrders: 14_823,
    avgOrderValue: 263.12,
    growthRate: 6.1,
    monthly: [
      { month: "January",   monthShort: "Jan", revenue: 241_800, units: 3_212, orders:   923 },
      { month: "February",  monthShort: "Feb", revenue: 223_400, units: 2_987, orders:   851 },
      { month: "March",     monthShort: "Mar", revenue: 298_700, units: 4_012, orders: 1_142 },
      { month: "April",     monthShort: "Apr", revenue: 282_300, units: 3_789, orders: 1_081 },
      { month: "May",       monthShort: "May", revenue: 318_240, units: 4_312, orders: 1_219 },
      { month: "June",      monthShort: "Jun", revenue: 347_900, units: 4_697, orders: 1_334 },
      { month: "July",      monthShort: "Jul", revenue: 334_210, units: 4_521, orders: 1_278 },
      { month: "August",    monthShort: "Aug", revenue: 354_780, units: 4_812, orders: 1_356 },
      { month: "September", monthShort: "Sep", revenue: 371_890, units: 5_021, orders: 1_432 },
      { month: "October",   monthShort: "Oct", revenue: 329_450, units: 4_456, orders: 1_259 },
      { month: "November",  monthShort: "Nov", revenue: 389_840, units: 5_287, orders: 1_498 },
      { month: "December",  monthShort: "Dec", revenue: 407_244, units: 5_235, orders: 1_450 },
    ],
    categories: [
      { category: "Technology",   revenue: 1_396_890, units: 13_987, color: "#3B82F6" },
      { category: "Furniture",    revenue: 1_047_560, units: 14_987, color: "#E85D26" },
      { category: "Office Supp.", revenue:   742_120, units: 16_523, color: "#10B981" },
      { category: "Apparel",      revenue:   454_782, units:  6_844, color: "#8B5CF6" },
      { category: "Electronics",  revenue:   258_402, units:      0, color: "#F59E0B" },
    ],
    regions: [
      { region: "West",    revenue: 1_294_870, growth:  7.4 },
      { region: "East",    revenue: 1_012_980, growth:  5.9 },
      { region: "Central", revenue:   801_340, growth:  4.2 },
      { region: "South",   revenue:   790_564, growth:  6.9 },
    ],
  },
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function getYearOverYearChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getComparisonData(years: Year[]) {
  return years.map((year) => ({
    year,
    data: SALES_DATA[year],
  }));
}

export const ALL_YEARS: Year[] = [2024, 2023, 2022];
export const YEAR_COLORS: Record<Year, string> = {
  2024: "#E85D26",
  2023: "#3B82F6",
  2022: "#10B981",
};

// ADD THIS to the bottom of your existing lib/sales-data.ts file
// (copy and paste these lines at the very end of the file)

// ── 2024 Monthly Revenue Array ─────────────────────────────────────────────
// Used by ForecastChart to show 2024 actual vs 2025 forecast side by side
export const RAW_DATA_2024: number[] = [
  312_450, 289_300, 378_920, 361_200, 402_780, 438_560,
  421_300, 445_820, 467_990, 412_340, 489_210, 472_547,
];
