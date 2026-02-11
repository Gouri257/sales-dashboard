"use client";

import { Card } from "@/components/atoms/Card";
import { TrendIndicator } from "@/components/atoms/TrendIndicator";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/sales-data";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
} from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change: number;
  changeLabel: string;
  icon: "dollar" | "cart" | "package" | "trend";
  color?: "accent" | "emerald" | "sapphire" | "default";
  animationDelay?: number;
}

const iconMap = {
  dollar: DollarSign,
  cart: ShoppingCart,
  package: Package,
  trend: TrendingUp,
};

const colorMap = {
  accent: {
    icon: "text-accent",
    bg: "bg-accent-muted",
    border: "border-accent/20",
    glow: "shadow-accent/5",
  },
  emerald: {
    icon: "text-emerald-DEFAULT",
    bg: "bg-emerald-muted",
    border: "border-emerald/20",
    glow: "shadow-emerald/5",
  },
  sapphire: {
    icon: "text-sapphire-DEFAULT",
    bg: "bg-sapphire-muted",
    border: "border-sapphire/20",
    glow: "shadow-sapphire/5",
  },
  default: {
    icon: "text-ink-300",
    bg: "bg-ink-700",
    border: "border-ink-600",
    glow: "",
  },
};

function formatValue(value: number, format: "currency" | "number" | "percent") {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "number":
      return formatNumber(value);
    case "percent":
      return formatPercent(value);
  }
}

export function KpiCard({
  label,
  value,
  format,
  change,
  changeLabel,
  icon,
  color = "default",
  animationDelay = 0,
}: KpiCardProps) {
  const Icon = iconMap[icon];
  const colors = colorMap[color];

  return (
    <Card
      variant="elevated"
      className={cn(
        "relative overflow-hidden group hover:border-ink-600 transition-all duration-300",
        "animate-slide-up opacity-0",
        colors.border,
        `shadow-xl ${colors.glow}`
      )}
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "forwards" } as React.CSSProperties}
    >
      {/* Subtle top accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px",
          color === "accent" && "bg-gradient-to-r from-transparent via-accent/60 to-transparent",
          color === "emerald" && "bg-gradient-to-r from-transparent via-emerald/60 to-transparent",
          color === "sapphire" && "bg-gradient-to-r from-transparent via-sapphire/60 to-transparent",
          color === "default" && "bg-gradient-to-r from-transparent via-ink-500/40 to-transparent",
        )}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-ink-400 font-mono text-xs uppercase tracking-widest mb-3">
            {label}
          </p>
          <p className="text-ink-50 font-display text-3xl font-normal tracking-tight">
            {formatValue(value, format)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <TrendIndicator value={change} />
            <span className="text-ink-500 font-mono text-xs">{changeLabel}</span>
          </div>
        </div>

        <div className={cn("p-3 rounded-xl", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>
    </Card>
  );
}
