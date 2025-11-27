"use client";

import { Task } from "../../types/process";

interface StatusSelectProps {
  status: Task["status"];
  onStatusChange: (status: Task["status"]) => void;
  disabled?: boolean;
}

const statusOptions: Task["status"][] = ["Pending", "Approved", "Needs Fix"];

const statusColors = {
  Pending:
    "bg-yellow-900 dark:bg-yellow-900/30 text-yellow-100 border-yellow-300 dark:border-yellow-700",
  Approved:
    "bg-green-900 dark:bg-green-900/30 text-green-100 border-green-300 dark:border-green-700",
  "Needs Fix":
    "bg-red-900 dark:bg-red-900/30 text-red-100 border-red-300 dark:border-red-700",
};

export default function StatusSelect({
  status,
  onStatusChange,
  disabled = false,
}: StatusSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onStatusChange(e.target.value as Task["status"]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    e.stopPropagation();

    // Cycle through statuses with arrow keys
    if (disabled) return;

    const currentIndex = statusOptions.indexOf(status);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % statusOptions.length;
      onStatusChange(statusOptions[nextIndex]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + statusOptions.length) % statusOptions.length;
      onStatusChange(statusOptions[prevIndex]);
    } else if (e.key === "Enter" || e.key === " ") {
      // Let the native select behavior handle opening the dropdown
      e.stopPropagation();
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Change task status. Current status: ${status}`}
        tabIndex={disabled ? -1 : 0}
        className={`
          appearance-none text-xs font-semibold px-3 py-1.5 pr-7 rounded-md 
          border-2 cursor-pointer transition-all duration-200 whitespace-nowrap
          [&>option]:cursor-pointer
          ${statusColors[status]}
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
        {statusOptions.map((option) => (
          <option
            key={option}
            value={option}
            className="cursor-pointer bg-background text-black dark:text-white"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
