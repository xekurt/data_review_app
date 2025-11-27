import {
  ChangelogEntry,
  Comment,
  Process,
  Subprocess,
  Task,
} from "../../types/process";

export const STORAGE_KEYS = {
  PROCESSES: "process-store",
} as const;

export const recalculateCaches = (processes: Process[]) => {
  const subprocessesCache = processes.flatMap((p) =>
    p.subprocesses.map((sp) => ({
      ...sp,
      processId: p.id,
    }))
  );
  const tasksCache = processes.flatMap((p) =>
    p.subprocesses.flatMap((sp) =>
      sp.tasks.map((t) => ({
        ...t,
        processId: p.id,
        subprocessId: sp.id,
      }))
    )
  );
  return { subprocessesCache, tasksCache };
};

export const persistToStorage = (processes: Process[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
  }
};
export const createComment = (text: string, author: string): Comment => ({
  id: `comment-${Date.now()}-${Math.random()}`,
  text,
  author,
  createdAt: new Date().toISOString(),
});

export const createChangelogEntry = (
  itemName: string,
  itemType: ChangelogEntry["itemType"],
  oldStatus: Process["status"],
  newStatus: Process["status"]
): ChangelogEntry => ({
  id: `changelog-${Date.now()}-${Math.random()}`,
  itemName,
  itemType,
  oldStatus,
  newStatus,
  changedBy: "user-1",
  changedAt: new Date().toISOString(),
});
export const findProcess = (processes: Process[], processId: string) =>
  processes.find((p) => p.id === processId);

export const findSubprocess = (
  process: Process | undefined,
  subprocessId: string
) => process?.subprocesses.find((sp: Subprocess) => sp.id === subprocessId);

export const findTask = (
  subprocess: ReturnType<typeof findSubprocess>,
  taskId: string
) => subprocess?.tasks.find((t: Task) => t.id === taskId);
