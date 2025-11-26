"use client";

interface ProgressHintProps {
  total: number;
  completed: number;
  label?: string; // optional descriptor, e.g., "Tasks Approved"
  className?: string;
}

export default function ProgressHint({
  total,
  completed,
  label,
  className = "",
}: ProgressHintProps) {
  const percentage = total <= 0 ? 0 : Math.round((completed / total) * 100);
  const safeCompleted = Math.min(Math.max(completed, 0), total);
  const showEmptyState = total <= 0;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {label ? `${label}: ` : ""}
          {showEmptyState ? "No items" : `${safeCompleted} / ${total} Approved`}
        </span>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full 
            transition-all duration-300 ${
              percentage >= 80
                ? "bg-green-900" // green from theme
                : percentage >= 50
                ? "bg-green-500" // brand secondary mid
                : "bg-red-600" // orange from theme
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
