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
  setProcesses: (processes) => {
    set({ processes });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
    }
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
          set({ processes: JSON.parse(cached), isLoading: false });
          return;
        }
      }

      // Simulate real-world delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fetch from API
      const response = await fetch("/data/processes.json");
      if (!response.ok) throw new Error("Failed to fetch processes");
      const processes = await response.json();

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
      }
      set({ processes, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage, isLoading: false });
    }
  },
  getSubprocesses: () => {
    const state = get();
    return state.processes.flatMap((p) =>
      p.subprocesses.map((sp) => ({
        ...sp,
        processId: p.id,
      }))
    );
  },
  getTasks: () => {
    const state = get();
    return state.processes.flatMap((p) =>
      p.subprocesses.flatMap((sp) =>
        sp.tasks.map((t) => ({
          ...t,
          processId: p.id,
          subprocessId: sp.id,
        }))
      )
    );
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
    set((state) => ({
      processes: state.processes.map((p) =>
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
      ),
    })),
  updateSubprocessStatus: (processId, subprocessId, status) =>
    set((state) => ({
      processes: state.processes.map((p) =>
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
      ),
    })),
  updateTask: (processId, subprocessId, taskId, updates) =>
    set((state) => ({
      processes: state.processes.map((p) =>
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
      ),
    })),
  updateTaskStatus: (processId, subprocessId, taskId, status) =>
    set((state) => ({
      processes: state.processes.map((p) =>
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
      ),
    })),
}));
