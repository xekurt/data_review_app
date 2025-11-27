import { create } from "zustand";
import type { Process, Task, ChangelogEntry } from "../types/process";
import {
  createChangelogEntry,
  createComment,
  persistToStorage,
  recalculateCaches,
  STORAGE_KEYS,
} from "./helpers";
import type { ProcessStore } from "./type";

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  selectedProcess: null,
  selectedSubprocess: null,
  selectedTask: null,
  isLoading: false,
  error: null,
  _subprocessesCache: null,
  _tasksCache: null,
  changelog: [],
  initializeProcesses: async () => {
    set({ isLoading: true, error: null });
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEYS.PROCESSES);
        if (cached) {
          const processes = JSON.parse(cached);
          const { subprocessesCache, tasksCache } =
            recalculateCaches(processes);
          set({
            processes,
            _subprocessesCache: subprocessesCache,
            _tasksCache: tasksCache,
            isLoading: false,
          });
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("/data/processes.json");
      if (!response.ok) throw new Error("Failed to fetch processes");
      const processes = await response.json();

      const { subprocessesCache, tasksCache } = recalculateCaches(processes);

      persistToStorage(processes);
      set({
        processes,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage, isLoading: false });
    }
  },

  setProcesses: (processes) => {
    const { subprocessesCache, tasksCache } = recalculateCaches(processes);
    persistToStorage(processes);
    set({
      processes,
      _subprocessesCache: subprocessesCache,
      _tasksCache: tasksCache,
    });
  },

  setSelectedProcess: (process) => set({ selectedProcess: process }),
  setSelectedSubprocess: (subprocess) =>
    set({ selectedSubprocess: subprocess }),
  setSelectedTask: (task) => set({ selectedTask: task }),

  getSubprocesses: () => {
    const state = get();
    return state._subprocessesCache || [];
  },

  getTasks: () => {
    const state = get();
    return state._tasksCache || [];
  },

  getChangelog: () => {
    const state = get();
    return state.changelog;
  },

  updateProcessStatus: (processId, status) =>
    set((state) => {
      const process = state.processes.find((p) => p.id === processId);
      if (!process) return state;

      const changelogEntry = createChangelogEntry(
        process.name,
        "Process",
        process.status,
        status
      );

      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? { ...p, status, lastUpdatedAt: new Date().toISOString() }
          : p
      );
      persistToStorage(updatedProcesses);
      return {
        processes: updatedProcesses,
        changelog: [...state.changelog, changelogEntry],
      };
    }),

  updateSubprocessStatus: (processId, subprocessId, status) =>
    set((state) => {
      const process = state.processes.find((p) => p.id === processId);
      const subprocess = process?.subprocesses.find(
        (sp) => sp.id === subprocessId
      );
      if (!subprocess) return state;

      const changelogEntry = createChangelogEntry(
        subprocess.name,
        "Subprocess",
        subprocess.status,
        status
      );

      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) =>
                sp.id === subprocessId
                  ? { ...sp, status, lastUpdatedAt: new Date().toISOString() }
                  : sp
              ),
            }
          : p
      );
      const { subprocessesCache, tasksCache } =
        recalculateCaches(updatedProcesses);
      persistToStorage(updatedProcesses);
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
        changelog: [...state.changelog, changelogEntry],
      };
    }),

  updateTaskStatus: (processId, subprocessId, taskId, status) =>
    set((state) => {
      const process = state.processes.find((p) => p.id === processId);
      const subprocess = process?.subprocesses.find(
        (sp) => sp.id === subprocessId
      );
      const task = subprocess?.tasks.find((t) => t.id === taskId);
      if (!task || !subprocess) return state;

      const changelogEntries: ChangelogEntry[] = [
        createChangelogEntry(task.name, "Task", task.status, status),
      ];

      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) =>
                sp.id === subprocessId
                  ? {
                      ...sp,
                      tasks: sp.tasks.map((t) =>
                        t.id === taskId
                          ? {
                              ...t,
                              status,
                              lastUpdatedAt: new Date().toISOString(),
                            }
                          : t
                      ),
                    }
                  : sp
              ),
            }
          : p
      );

      const finalProcesses = updatedProcesses.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) => {
                if (sp.id === subprocessId) {
                  const allApproved = sp.tasks.every(
                    (t) => t.status === "Approved"
                  );
                  const anyNeedsFix = sp.tasks.some(
                    (t) => t.status === "Needs Fix"
                  );

                  const subprocessStatus: Task["status"] = allApproved
                    ? "Approved"
                    : anyNeedsFix
                    ? "Needs Fix"
                    : "Pending";

                  if (subprocessStatus !== sp.status) {
                    changelogEntries.push(
                      createChangelogEntry(
                        sp.name,
                        "Subprocess",
                        sp.status,
                        subprocessStatus
                      )
                    );
                  }

                  return {
                    ...sp,
                    status: subprocessStatus,
                    lastUpdatedAt: new Date().toISOString(),
                  };
                }
                return sp;
              }),
            }
          : p
      );

      const processUpdatedFinal = finalProcesses.map((p) => {
        if (p.id === processId) {
          const allSubprocessesApproved = p.subprocesses.every(
            (sp) => sp.status === "Approved"
          );
          const allTasksApproved = p.subprocesses.every((sp) =>
            sp.tasks.every((t) => t.status === "Approved")
          );

          if (allSubprocessesApproved && allTasksApproved) {
            const newProcessStatus: Process["status"] = "Approved";

            if (newProcessStatus !== p.status) {
              changelogEntries.push(
                createChangelogEntry(
                  p.name,
                  "Process",
                  p.status,
                  newProcessStatus
                )
              );
            }

            return {
              ...p,
              status: newProcessStatus,
              lastUpdatedAt: new Date().toISOString(),
            };
          }
        }
        return p;
      });

      const { subprocessesCache, tasksCache } =
        recalculateCaches(processUpdatedFinal);
      persistToStorage(processUpdatedFinal);
      return {
        processes: processUpdatedFinal,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
        changelog: [...state.changelog, ...changelogEntries],
      };
    }),

  addProcessComment: (processId, text, author) =>
    set((state) => {
      const newComment = createComment(text, author);
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              comments: [...p.comments, newComment],
              lastUpdatedAt: new Date().toISOString(),
            }
          : p
      );
      persistToStorage(updatedProcesses);
      return { processes: updatedProcesses };
    }),

  addSubprocessComment: (processId, subprocessId, text, author) =>
    set((state) => {
      const newComment = createComment(text, author);
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) =>
                sp.id === subprocessId
                  ? {
                      ...sp,
                      comments: [...sp.comments, newComment],
                      lastUpdatedAt: new Date().toISOString(),
                    }
                  : sp
              ),
            }
          : p
      );
      const { subprocessesCache } = recalculateCaches(updatedProcesses);
      persistToStorage(updatedProcesses);
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
      };
    }),

  addTaskComment: (processId, subprocessId, taskId, text, author) =>
    set((state) => {
      const newComment = createComment(text, author);
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) =>
                sp.id === subprocessId
                  ? {
                      ...sp,
                      tasks: sp.tasks.map((t) =>
                        t.id === taskId
                          ? {
                              ...t,
                              comments: [...t.comments, newComment],
                              lastUpdatedAt: new Date().toISOString(),
                            }
                          : t
                      ),
                    }
                  : sp
              ),
            }
          : p
      );
      const { tasksCache } = recalculateCaches(updatedProcesses);
      persistToStorage(updatedProcesses);
      return { processes: updatedProcesses, _tasksCache: tasksCache };
    }),
}));
