import { NextRequest, NextResponse } from "next/server";
import { SALES_DATA, ALL_YEARS } from "@/lib/sales-data";
import type { Year, SalesApiResponse } from "@/types/sales";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const yearsParam = searchParams.get("years");
  const threshold = Number(searchParams.get("threshold") ?? 0);

  // Parse requested years, default to all
  let requestedYears: Year[] = ALL_YEARS;
  if (yearsParam) {
    requestedYears = yearsParam
      .split(",")
      .map(Number)
      .filter((y): y is Year => y === 2022 || y === 2023 || y === 2024);
  }

  // Apply revenue threshold filter to monthly data
  const filteredData = requestedYears.map((year) => {
    const yearData = SALES_DATA[year];
    return {
      ...yearData,
      monthly: yearData.monthly.filter((m) => m.revenue >= threshold),
    };
  });

  const response: SalesApiResponse = {
    data: filteredData,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
