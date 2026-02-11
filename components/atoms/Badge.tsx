import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default: "bg-ink-700 text-ink-200 border border-ink-600",
  success: "bg-emerald-muted text-emerald-light border border-emerald",
  warning: "bg-yellow-900/30 text-yellow-300 border border-yellow-600/50",
  error: "bg-red-900/30 text-red-300 border border-red-600/50",
  info: "bg-sapphire-muted text-sapphire-light border border-sapphire/50",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
