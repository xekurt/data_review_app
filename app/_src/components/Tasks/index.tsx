"use client";

import { useProcessData } from "../../hooks/useProcessData";
import { useSubprocessData } from "../../hooks/useProcessData";
import { useTaskData } from "../../hooks/useProcessData";
import ListItem from "../common/ListItem";
import Comments from "../common/Comments";

export default function Tasks() {
  const { selectedProcess } = useProcessData();
  const { selectedSubprocess } = useSubprocessData();
  const {
    tasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    addTaskComment,
  } = useTaskData();

  if (!selectedProcess || !selectedSubprocess) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
          No Subprocess Selected
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Select a subprocess from the middle panel to view its tasks
        </p>
      </div>
    );
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.processId === selectedProcess.id &&
      task.subprocessId === selectedSubprocess.id
  );

  return (
    <div className="p-6 flex flex-col gap-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold" id="tasks-heading">
        Tasks
      </h1>
      <div className="space-y-4" role="list" aria-labelledby="tasks-heading">
        {filteredTasks.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">
              No Tasks
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              This subprocess doesn't have any tasks yet
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <ListItem
              key={task.id}
              title={task.name}
              description={task.description}
              status={task.status}
              lastUpdatedBy={task.lastUpdatedBy}
              lastUpdatedAt={task.lastUpdatedAt}
              isSelected={selectedTask?.id === task.id}
              onClick={() => setSelectedTask(task)}
              isTask={true}
              taskId={task.id}
              processId={task.processId}
              subprocessId={task.subprocessId}
              onStatusChange={(status) =>
                updateTaskStatus(
                  task.processId,
                  task.subprocessId,
                  task.id,
                  status
                )
              }
            >
              <Comments
                comments={task.comments}
                onAddComment={(text, author) =>
                  addTaskComment(
                    task.processId,
                    task.subprocessId,
                    task.id,
                    text,
                    author
                  )
                }
              />
            </ListItem>
          ))
        )}
      </div>
    </div>
  );
}
