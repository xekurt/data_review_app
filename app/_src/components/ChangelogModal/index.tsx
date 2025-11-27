"use client";

import { ChangelogEntry } from "../../types/process";
import { formatDate } from "../../utils/formatters";

interface ChangelogModalProps {
  entries: ChangelogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  Pending: "text-yellow-800 dark:text-yellow-200",
  Approved: "text-green-800 dark:text-green-200",
  "Needs Fix": "text-red-800 dark:text-red-200",
};

export default function ChangelogModal({
  entries,
  isOpen,
  onClose,
}: ChangelogModalProps) {
  if (!isOpen) return null;

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] m-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Activity Log ({entries.length} changes)
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {sortedEntries.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 italic">
                No status changes yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                      What
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                      Type
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                      Status Change
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                      Who
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
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
                      <td className="p-3 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                        {entry.itemName}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700">
                          {entry.itemType}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-300 dark:border-gray-600">
                        <span
                          className={`font-medium ${
                            statusColors[entry.oldStatus]
                          }`}
                        >
                          {entry.oldStatus}
                        </span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span
                          className={`font-medium ${
                            statusColors[entry.newStatus]
                          }`}
                        >
                          {entry.newStatus}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                        {entry.changedBy}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 whitespace-nowrap">
                        {formatDate(entry.changedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
