"use client";

import { ReactNode } from "react";

interface ListItemProps {
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
  status?: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
  children?: ReactNode;
}

const statusColors = {
  Pending:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
  Approved:
    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  "Needs Fix": "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
};

export default function ListItem({
  title,
  description,
  isSelected = false,
  onClick,
  status,
  lastUpdatedBy,
  lastUpdatedAt,
  children,
}: ListItemProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg ring-2 ring-primary-500 ring-opacity-30"
          : "border-gray-200 dark:border-gray-700 hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        {status && (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${statusColors[status]}`}
          >
            {status}
          </span>
        )}
      </div>
      {(lastUpdatedBy || lastUpdatedAt) && (
        <div className="flex items-center justify-between gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
          {lastUpdatedBy && <span>Updated by: {lastUpdatedBy}</span>}
          {lastUpdatedAt && <span>{formatDate(lastUpdatedAt)}</span>}
        </div>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
