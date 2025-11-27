"use client";

import { useProcessData } from "../../hooks/useProcessData";
import { useSubprocessData } from "../../hooks/useProcessData";
import ListItem from "../common/ListItem";
import ProgressHint from "../common/ProgressHint";
import Comments from "../common/Comments";
import { getSubprocessTaskProgress } from "../../utils/progress";

export default function Subprocesses() {
  const { selectedProcess } = useProcessData();
  const {
    subprocesses,
    selectedSubprocess,
    setSelectedSubprocess,
    addSubprocessComment,
  } = useSubprocessData();

  if (!selectedProcess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 h-full">
        <svg
          className="w-24 h-24 mb-4 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
          No Process Selected
        </p>
        <p className="text-sm text-center text-gray-500 dark:text-gray-500">
          Select a process from the left to view its subprocesses
        </p>
      </div>
    );
  }

  const filteredSubprocesses = subprocesses.filter(
    (sp) => sp.processId === selectedProcess.id
  );

  return (
    <div className="p-6 flex flex-col gap-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold" id="subprocesses-heading">
        Subprocesses
      </h1>
      <div
        className="space-y-4"
        role="list"
        aria-labelledby="subprocesses-heading"
      >
        {filteredSubprocesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
            <svg
              className="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">
              No Subprocesses
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              This process doesn't have any subprocesses yet
            </p>
          </div>
        ) : (
          filteredSubprocesses.map((subprocess, index) => {
            const taskProgress = getSubprocessTaskProgress(subprocess);

            // Check if previous subprocess is fully approved
            let isDisabled = false;
            if (index > 0) {
              const previousSubprocess = filteredSubprocesses[index - 1];
              const previousProgress =
                getSubprocessTaskProgress(previousSubprocess);
              isDisabled = previousProgress.approved !== previousProgress.total;
            }

            return (
              <ListItem
                key={subprocess.id}
                title={subprocess.name}
                description={subprocess.description}
                status={subprocess.status}
                lastUpdatedBy={subprocess.lastUpdatedBy}
                lastUpdatedAt={subprocess.lastUpdatedAt}
                isSelected={selectedSubprocess?.id === subprocess.id}
                onClick={() => setSelectedSubprocess(subprocess)}
                isDisabled={isDisabled}
              >
                <ProgressHint
                  label="Tasks"
                  total={taskProgress.total}
                  completed={taskProgress.approved}
                />

                <Comments
                  comments={subprocess.comments}
                  onAddComment={(text, author) =>
                    addSubprocessComment(
                      subprocess.processId,
                      subprocess.id,
                      text,
                      author
                    )
                  }
                />
              </ListItem>
            );
          })
        )}
      </div>
    </div>
  );
}
