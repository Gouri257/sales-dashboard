import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

const variantStyles = {
  primary:
    "bg-accent text-white hover:bg-accent-light active:bg-accent-dark shadow-lg shadow-accent/20",
  secondary:
    "bg-ink-700 text-ink-100 hover:bg-ink-600 active:bg-ink-700 border border-ink-600",
  ghost:
    "bg-transparent text-ink-300 hover:text-ink-100 hover:bg-ink-800 active:bg-ink-700",
  outline:
    "bg-transparent text-ink-200 border border-ink-600 hover:border-ink-400 hover:text-ink-100",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  isActive = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 font-body font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        isActive && variant === "ghost" && "bg-ink-700 text-ink-100",
        isActive && variant === "outline" && "bg-ink-700 border-ink-400 text-ink-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
