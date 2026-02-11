import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, prefix, suffix, helperText, error, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium font-mono text-ink-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-ink-400 font-mono text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-ink-800 border border-ink-600 rounded-lg text-ink-100 font-mono text-sm",
            "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/70",
            "placeholder:text-ink-500 transition-colors duration-150",
            "py-2 px-3",
            prefix && "pl-7",
            suffix && "pr-10",
            error && "border-red-500/70 focus:ring-red-500/30 focus:border-red-500/70",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-ink-400 font-mono text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {(helperText || error) && (
        <p className={cn("text-xs font-mono", error ? "text-red-400" : "text-ink-500")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
});
