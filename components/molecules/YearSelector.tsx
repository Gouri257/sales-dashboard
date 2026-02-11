"use client";

import { Button } from "@/components/atoms/Button";
import { Year } from "@/types/sales";
import { ALL_YEARS, YEAR_COLORS } from "@/lib/sales-data";
import { cn } from "@/lib/utils";

interface YearSelectorProps {
  selectedYears: Year[];
  onChange: (years: Year[]) => void;
}

export function YearSelector({ selectedYears, onChange }: YearSelectorProps) {
  function toggle(year: Year) {
    if (selectedYears.includes(year)) {
      // Don't deselect if it's the only one selected
      if (selectedYears.length === 1) return;
      onChange(selectedYears.filter((y) => y !== year));
    } else {
      onChange([...selectedYears, year].sort((a, b) => b - a));
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-ink-500 font-mono text-xs uppercase tracking-wider mr-1">
        Years
      </span>
      {ALL_YEARS.map((year) => {
        const isActive = selectedYears.includes(year);
        const color = YEAR_COLORS[year];

        return (
          <button
            key={year}
            onClick={() => toggle(year)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all duration-150",
              isActive
                ? "text-ink-100"
                : "text-ink-500 bg-ink-900 border border-ink-700 hover:text-ink-300"
            )}
            style={
              isActive
                ? {
                    backgroundColor: `${color}22`,
                    borderColor: `${color}55`,
                    color: color,
                  }
                : undefined
            }
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: isActive ? color : "#4A4A55" }}
            />
            {year}
          </button>
        );
      })}
    </div>
  );
}
