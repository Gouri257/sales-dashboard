import { Badge } from "@/components/atoms/Badge";
import { BarChart2 } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent-muted rounded-xl border border-accent/20">
            <BarChart2 className="w-5 h-5 text-accent" />
          </div>
          <Badge variant="info" size="sm">
            Live via API
          </Badge>
        </div>
        <h1 className="text-ink-50 font-display text-4xl tracking-tight">
          Sales Dashboard
        </h1>
        <p className="text-ink-400 font-mono text-sm mt-1">
          Superstore Sales · 2022 – 2024 · Inspired by Kaggle Dataset
        </p>
      </div>

      <div className="hidden md:flex flex-col items-end gap-1 text-right">
        <span className="text-ink-500 font-mono text-xs uppercase tracking-wider">
          Last Updated
        </span>
        <span className="text-ink-300 font-mono text-sm">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
