import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import ForecastChart from "@/components/organisms/ForecastChart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Sales Analytics",
  description: "View sales performance across 2022, 2023, and 2024.",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardTemplate />
      <div className="px-6 pb-10">
        <ForecastChart />
      </div>
    </>
  );
}
