"use client";

import { Button } from "@/components/atoms/Button";
import { ChartType } from "@/types/sales";
import { BarChart2, LineChart, AreaChart, PieChart } from "lucide-react";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

const chartOptions: { type: ChartType; label: string; Icon: React.ElementType }[] = [
  { type: "bar",  label: "Bar",  Icon: BarChart2 },
  { type: "line", label: "Line", Icon: LineChart },
  { type: "area", label: "Area", Icon: AreaChart },
  { type: "pie",  label: "Pie",  Icon: PieChart },
];

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-ink-900 rounded-lg p-1 border border-ink-700">
      {chartOptions.map(({ type, label, Icon }) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          isActive={value === type}
          onClick={() => onChange(type)}
          className={
            value === type
              ? "bg-ink-700 text-ink-100"
              : "text-ink-400 hover:text-ink-200"
          }
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
