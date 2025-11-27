"use client";

import { ReactNode } from "react";

interface SelectInputProps<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel?: string;
  getColorClass?: (value: T) => string;
  renderOption?: (option: T) => ReactNode;
}

export default function SelectInput<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel,
  getColorClass,
  renderOption,
}: SelectInputProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onChange(e.target.value as T);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    e.stopPropagation();

    if (disabled) return;

    const currentIndex = options.indexOf(value);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
    }
  };

  const colorClass = getColorClass ? getColorClass(value) : "";

  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        aria-label={ariaLabel || `Select option. Current: ${value}`}
        tabIndex={disabled ? -1 : 0}
        className={`
          appearance-none text-xs font-semibold px-3 py-1.5 pr-7 rounded-md 
          border-2 cursor-pointer transition-all duration-200 whitespace-nowrap
          [&>option]:cursor-pointer
          ${colorClass}
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-md hover:scale-105 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 focus:outline-none active:scale-100"
          }
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.25rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25rem 1.25rem",
        }}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="cursor-pointer bg-background text-black dark:text-white"
          >
            {renderOption ? renderOption(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}
