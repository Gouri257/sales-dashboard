import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value: number;
  showIcon?: boolean;
  className?: string;
}

export function TrendIndicator({
  value,
  showIcon = true,
  className,
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-sm font-medium",
        isNeutral
          ? "text-ink-400"
          : isPositive
          ? "text-emerald-DEFAULT"
          : "text-red-400",
        className
      )}
    >
      {showIcon && !isNeutral && (
        isPositive ? (
          <TrendingUp size={14} />
        ) : (
          <TrendingDown size={14} />
        )
      )}
      {showIcon && isNeutral && <Minus size={14} />}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}
