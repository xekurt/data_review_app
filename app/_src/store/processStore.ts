import { create } from "zustand";
import type { Process, Subprocess, Task } from "../types/process";
import { STORAGE_KEYS } from "./constants";

interface ProcessStore {
  processes: Process[];
  selectedProcess: Process | null;
  selectedSubprocess: (Subprocess & { processId: string }) | null;
  selectedTask: (Task & { processId: string; subprocessId: string }) | null;
  isLoading: boolean;
  error: string | null;
  _subprocessesCache: (Subprocess & { processId: string })[] | null;
  _tasksCache: (Task & { processId: string; subprocessId: string })[] | null;
  setProcesses: (processes: Process[]) => void;
  setSelectedProcess: (process: Process | null) => void;
  setSelectedSubprocess: (
    subprocess: (Subprocess & { processId: string }) | null
  ) => void;
  setSelectedTask: (
    task: (Task & { processId: string; subprocessId: string }) | null
  ) => void;
  initializeProcesses: () => Promise<void>;
  getSubprocesses: () => (Subprocess & { processId: string })[];
  getTasks: () => (Task & { processId: string; subprocessId: string })[];
  updateProcess: (processId: string, updates: Partial<Process>) => void;
  updateProcessStatus: (processId: string, status: Process["status"]) => void;
  updateSubprocess: (
    processId: string,
    subprocessId: string,
    updates: Partial<Subprocess>
  ) => void;
  updateSubprocessStatus: (
    processId: string,
    subprocessId: string,
    status: Subprocess["status"]
  ) => void;
  updateTask: (
    processId: string,
    subprocessId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  updateTaskStatus: (
    processId: string,
    subprocessId: string,
    taskId: string,
    status: Task["status"]
  ) => void;
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  selectedProcess: null,
  selectedSubprocess: null,
  selectedTask: null,
  isLoading: false,
  error: null,
  _subprocessesCache: null,
  _tasksCache: null,
  setProcesses: (processes) => {
    set((state) => {
      const subprocessesCache = state.processes.flatMap((p) =>
        p.subprocesses.map((sp) => ({
          ...sp,
          processId: p.id,
        }))
      );
      const tasksCache = state.processes.flatMap((p) =>
        p.subprocesses.flatMap((sp) =>
          sp.tasks.map((t) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
      }
      return {
        processes,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    });
  },
  setSelectedProcess: (process) => set({ selectedProcess: process }),
  setSelectedSubprocess: (subprocess) =>
    set({ selectedSubprocess: subprocess }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  initializeProcesses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Check localStorage first
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEYS.PROCESSES);
        if (cached) {
          const processes = JSON.parse(cached);
          const subprocessesCache = processes.flatMap((p: Process) =>
            p.subprocesses.map((sp: Subprocess) => ({
              ...sp,
              processId: p.id,
            }))
          );
          const tasksCache = processes.flatMap((p: Process) =>
            p.subprocesses.flatMap((sp: Subprocess) =>
              sp.tasks.map((t: Task) => ({
                ...t,
                processId: p.id,
                subprocessId: sp.id,
              }))
            )
          );
          set({
            processes,
            _subprocessesCache: subprocessesCache,
            _tasksCache: tasksCache,
            isLoading: false,
          });
          return;
        }
      }

      // Simulate real-world delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fetch from API
      const response = await fetch("/data/processes.json");
      if (!response.ok) throw new Error("Failed to fetch processes");
      const processes = await response.json();

      // Calculate caches
      const subprocessesCache = processes.flatMap((p: Process) =>
        p.subprocesses.map((sp: Subprocess) => ({
          ...sp,
          processId: p.id,
        }))
      );
      const tasksCache = processes.flatMap((p: Process) =>
        p.subprocesses.flatMap((sp: Subprocess) =>
          sp.tasks.map((t: Task) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
      }
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
  getSubprocesses: () => {
    const state = get();
    return state._subprocessesCache || [];
  },
  getTasks: () => {
    const state = get();
    return state._tasksCache || [];
  },
  updateProcess: (processId, updates) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId
          ? { ...p, ...updates, lastUpdatedAt: new Date().toISOString() }
          : p
      ),
    })),
  updateProcessStatus: (processId, status) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId
          ? { ...p, status, lastUpdatedAt: new Date().toISOString() }
          : p
      ),
    })),
  updateSubprocess: (processId, subprocessId, updates) =>
    set((state) => {
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) =>
                sp.id === subprocessId
                  ? {
                      ...sp,
                      ...updates,
                      lastUpdatedAt: new Date().toISOString(),
                    }
                  : sp
              ),
            }
          : p
      );
      const subprocessesCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.map((sp) => ({
          ...sp,
          processId: p.id,
        }))
      );
      const tasksCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.flatMap((sp) =>
          sp.tasks.map((t) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),
  updateSubprocessStatus: (processId, subprocessId, status) =>
    set((state) => {
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
      const subprocessesCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.map((sp) => ({
          ...sp,
          processId: p.id,
        }))
      );
      const tasksCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.flatMap((sp) =>
          sp.tasks.map((t) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),
  updateTask: (processId, subprocessId, taskId, updates) =>
    set((state) => {
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
                              ...updates,
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
      const subprocessesCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.map((sp) => ({
          ...sp,
          processId: p.id,
        }))
      );
      const tasksCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.flatMap((sp) =>
          sp.tasks.map((t) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),
  updateTaskStatus: (processId, subprocessId, taskId, status) =>
    set((state) => {
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

      // Calculate subprocess status based on tasks
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

                  let subprocessStatus: Task["status"];
                  if (allApproved) {
                    subprocessStatus = "Approved";
                  } else if (anyNeedsFix) {
                    subprocessStatus = "Needs Fix";
                  } else {
                    subprocessStatus = "Pending";
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

      const subprocessesCache = finalProcesses.flatMap((p) =>
        p.subprocesses.map((sp) => ({
          ...sp,
          processId: p.id,
        }))
      );
      const tasksCache = finalProcesses.flatMap((p) =>
        p.subprocesses.flatMap((sp) =>
          sp.tasks.map((t) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );
      return {
        processes: finalProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),
}));
