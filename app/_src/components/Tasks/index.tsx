"use client";

import { useProcessData } from "../../hooks/useProcessData";
import { useSubprocessData } from "../../hooks/useProcessData";
import { useTaskData } from "../../hooks/useProcessData";
import ListItem from "../ListItem";
import Comments from "../Comments";

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
      <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Select a subprocess to view tasks</p>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tasks found
          </p>
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
