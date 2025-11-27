"use client";

import { useProcessData } from "../../hooks/useProcessData";
import { useSubprocessData } from "../../hooks/useProcessData";
import ListItem from "../ListItem";
import ProgressHint from "../ProgressHint";
import Comments from "../Comments";
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
      <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Select a process to view subprocesses</p>
      </div>
    );
  }

  const filteredSubprocesses = subprocesses.filter(
    (sp) => sp.processId === selectedProcess.id
  );

  return (
    <div className="p-6 flex flex-col gap-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold">Subprocesses</h1>
      <div className="space-y-4">
        {filteredSubprocesses.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No subprocesses found
          </p>
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
