"use client";

import { useProcessData } from "../../hooks/useProcessData";
import ListItem from "../ListItem";
import ProgressHint from "../ProgressHint";
import Comments from "../Comments";
import {
  getProcessTaskProgress,
  getProcessSubprocessProgress,
} from "../../utils/progress";

export default function Processes() {
  const {
    processes,
    isLoading,
    error,
    selectedProcess,
    setSelectedProcess,
    addProcessComment,
    updateProcessStatus,
  } = useProcessData();

  if (isLoading) return <div className="p-6">Loading processes...</div>;
  if (error) return <div className="p-6 text-error">{error}</div>;

  return (
    <div className="p-6 flex flex-col gap-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold">Processes</h1>
      <div className="space-y-4">
        {processes.map((process) => {
          const taskProgress = getProcessTaskProgress(process);
          const subprocessProgress = getProcessSubprocessProgress(process);

          return (
            <ListItem
              key={process.id}
              title={process.name}
              description={process.description}
              status={process.status}
              lastUpdatedBy={process.lastUpdatedBy}
              lastUpdatedAt={process.lastUpdatedAt}
              isSelected={selectedProcess?.id === process.id}
              onClick={() => setSelectedProcess(process)}
            >
              <div className="space-y-2">
                <ProgressHint
                  label="Tasks"
                  total={taskProgress.total}
                  completed={taskProgress.approved}
                />
                <ProgressHint
                  label="SubProcesses"
                  total={subprocessProgress.total}
                  completed={subprocessProgress.approved}
                />
              </div>

              {process.status === "Pending" && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    All tasks and subprocesses are approved. Ready to approve
                    this process?
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateProcessStatus(process.id, "Approved");
                    }}
                    className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                  >
                    Approve Process
                  </button>
                </div>
              )}

              <Comments
                comments={process.comments}
                onAddComment={(text, author) =>
                  addProcessComment(process.id, text, author)
                }
              />
            </ListItem>
          );
        })}
      </div>
    </div>
  );
}
