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
  } = useProcessData();
  console.info(processes);
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
              {selectedProcess?.id === process.id && (
                <Comments
                  comments={process.comments}
                  onAddComment={(text, author) =>
                    addProcessComment(process.id, text, author)
                  }
                />
              )}
            </ListItem>
          );
        })}
      </div>
    </div>
  );
}
