import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Sales Analytics",
  description: "View sales performance across 2022, 2023, and 2024.",
};

export default function DashboardPage() {
  return <DashboardTemplate />;
}
