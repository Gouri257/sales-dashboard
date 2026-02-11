"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { SlidersHorizontal, X } from "lucide-react";

interface RevenueThresholdFilterProps {
  value: number;
  onChange: (threshold: number) => void;
}

export function RevenueThresholdFilter({
  value,
  onChange,
}: RevenueThresholdFilterProps) {
  const [inputValue, setInputValue] = useState(
    value > 0 ? value.toString() : ""
  );

  const handleApply = useCallback(() => {
    const parsed = Number(inputValue.replace(/[^0-9]/g, ""));
    onChange(isNaN(parsed) ? 0 : parsed);
  }, [inputValue, onChange]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onChange(0);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="flex items-end gap-2">
      <Input
        label="Min Monthly Revenue"
        prefix="$"
        placeholder="0"
        value={inputValue}
        onChange={(e) =>
          setInputValue(e.target.value.replace(/[^0-9]/g, ""))
        }
        onKeyDown={handleKeyDown}
        className="w-36"
        helperText="Filter months below this"
      />
      <div className="flex gap-1.5 mb-[1.625rem]">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleApply}
          className="h-9"
        >
          <SlidersHorizontal size={14} />
          Apply
        </Button>
        {value > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-9 text-ink-400 hover:text-red-400"
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
