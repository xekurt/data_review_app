"use client";

import { ChangelogEntry } from "../../types/process";
import { formatDate } from "../../utils/formatters";

interface ChangelogProps {
  entries: ChangelogEntry[];
}

const statusColors = {
  Pending: "text-yellow-800 dark:text-yellow-200",
  Approved: "text-green-800 dark:text-green-200",
  "Needs Fix": "text-red-800 dark:text-red-200",
};

export default function Changelog({ entries }: ChangelogProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Changelog ({entries.length})
      </h4>

      {sortedEntries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No status changes yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  What
                </th>
                <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  Type
                </th>
                <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  From → To
                </th>
                <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  Who
                </th>
                <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  When
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="p-2 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                    {entry.itemName}
                  </td>
                  <td className="p-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700">
                      {entry.itemType}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-600">
                    <span
                      className={`font-medium ${statusColors[entry.oldStatus]}`}
                    >
                      {entry.oldStatus}
                    </span>
                    <span className="mx-1 text-gray-400">→</span>
                    <span
                      className={`font-medium ${statusColors[entry.newStatus]}`}
                    >
                      {entry.newStatus}
                    </span>
                  </td>
                  <td className="p-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                    {entry.changedBy}
                  </td>
                  <td className="p-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 whitespace-nowrap">
                    {formatDate(entry.changedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
