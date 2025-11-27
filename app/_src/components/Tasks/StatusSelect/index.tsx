"use client";

import { Task } from "../../../types/process";
import SelectInput from "../../common/SelectInput";

interface StatusSelectProps {
  status: Task["status"];
  onStatusChange: (status: Task["status"]) => void;
  disabled?: boolean;
}

const statusOptions: Task["status"][] = ["Pending", "Approved", "Needs Fix"];

const statusColors: Record<Task["status"], string> = {
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
  return (
    <SelectInput
      value={status}
      options={statusOptions}
      onChange={onStatusChange}
      disabled={disabled}
      ariaLabel={`Change task status. Current status: ${status}`}
      getColorClass={(value) => statusColors[value]}
    />
  );
}
