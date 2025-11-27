import { create } from "zustand";
import type {
  Process,
  Subprocess,
  Task,
  Comment,
  ChangelogEntry,
} from "../types/process";
import { STORAGE_KEYS } from "./constants";

/**
 * ProcessStore - Zustand store for managing hierarchical process data
 *
 * Architecture:
 * - Processes contain Subprocesses, which contain Tasks
 * - All updates persist to localStorage automatically
 * - Caches flattened subprocesses and tasks with parent IDs for easy lookups
 */
interface ProcessStore {
  // ===== STATE =====
  /** Array of all processes with nested subprocesses and tasks */
  processes: Process[];
  /** Currently selected process for UI context */
  selectedProcess: Process | null;
  /** Currently selected subprocess with parent processId */
  selectedSubprocess: (Subprocess & { processId: string }) | null;
  /** Currently selected task with parent processId and subprocessId */
  selectedTask: (Task & { processId: string; subprocessId: string }) | null;
  /** Loading state for async initialization */
  isLoading: boolean;
  /** Error message if initialization fails */
  error: string | null;
  /** Flattened cache of all subprocesses with parent process IDs */
  _subprocessesCache: (Subprocess & { processId: string })[] | null;
  /** Flattened cache of all tasks with parent process and subprocess IDs */
  _tasksCache: (Task & { processId: string; subprocessId: string })[] | null;
  /** History of all status changes across processes, subprocesses, and tasks */
  changelog: ChangelogEntry[];

  // ===== SETTERS =====
  /** Set processes and recalculate caches. Persists to localStorage. */
  setProcesses: (processes: Process[]) => void;
  /** Set the currently selected process */
  setSelectedProcess: (process: Process | null) => void;
  /** Set the currently selected subprocess */
  setSelectedSubprocess: (
    subprocess: (Subprocess & { processId: string }) | null
  ) => void;
  /** Set the currently selected task */
  setSelectedTask: (
    task: (Task & { processId: string; subprocessId: string }) | null
  ) => void;

  // ===== INITIALIZATION =====
  /** Load processes from localStorage or fetch from API. Includes 1.5s simulated delay. */
  initializeProcesses: () => Promise<void>;

  // ===== GETTERS =====
  /** Get flattened array of all subprocesses with parent processId */
  getSubprocesses: () => (Subprocess & { processId: string })[];
  /** Get flattened array of all tasks with parent processId and subprocessId */
  getTasks: () => (Task & { processId: string; subprocessId: string })[];
  /** Get all changelog entries */
  getChangelog: () => ChangelogEntry[];

  // ===== PROCESS MUTATIONS =====
  /** Update a process with partial updates. Persists to localStorage. */
  updateProcess: (processId: string, updates: Partial<Process>) => void;
  /** Update only the status of a process. Persists to localStorage. */
  updateProcessStatus: (processId: string, status: Process["status"]) => void;

  // ===== SUBPROCESS MUTATIONS =====
  /** Update a subprocess with partial updates. Recalculates caches and persists. */
  updateSubprocess: (
    processId: string,
    subprocessId: string,
    updates: Partial<Subprocess>
  ) => void;
  /** Update only the status of a subprocess. Recalculates caches and persists. */
  updateSubprocessStatus: (
    processId: string,
    subprocessId: string,
    status: Subprocess["status"]
  ) => void;

  // ===== TASK MUTATIONS =====
  /** Update a task with partial updates. Recalculates caches and persists. */
  updateTask: (
    processId: string,
    subprocessId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  /**
   * Update task status and auto-update parent subprocess status.
   * Logic: All tasks approved → Approved, Any needs fix → Needs Fix, Otherwise → Pending
   * Recalculates caches and persists.
   */
  updateTaskStatus: (
    processId: string,
    subprocessId: string,
    taskId: string,
    status: Task["status"]
  ) => void;

  // ===== COMMENT MUTATIONS =====
  /** Add a comment to a process. Persists to localStorage. */
  addProcessComment: (processId: string, text: string, author: string) => void;
  /** Add a comment to a subprocess. Recalculates caches and persists. */
  addSubprocessComment: (
    processId: string,
    subprocessId: string,
    text: string,
    author: string
  ) => void;
  /** Add a comment to a task. Recalculates caches and persists. */
  addTaskComment: (
    processId: string,
    subprocessId: string,
    taskId: string,
    text: string,
    author: string
  ) => void;
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  // ===== INITIAL STATE =====
  processes: [],
  selectedProcess: null,
  selectedSubprocess: null,
  selectedTask: null,
  isLoading: false,
  error: null,
  _subprocessesCache: null,
  _tasksCache: null,
  changelog: [],

  // ===== SETTERS =====
  setProcesses: (processes) => {
    set(() => {
      // Recalculate flattened caches with parent IDs
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
      // Persist to localStorage
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

  // ===== INITIALIZATION =====
  initializeProcesses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to load from localStorage first
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEYS.PROCESSES);
        if (cached) {
          const processes = JSON.parse(cached);
          // Build caches from cached data
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

      // Simulate network delay for realistic loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fetch from JSON file (placeholder for real API)
      const response = await fetch("/data/processes.json");
      if (!response.ok) throw new Error("Failed to fetch processes");
      const processes = await response.json();

      // Build initial caches
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

      // Save to localStorage for next load
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

  // ===== GETTERS =====
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

  // ===== PROCESS MUTATIONS =====
  updateProcess: (processId, updates) =>
    set((state) => {
      // Immutably update the target process
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? { ...p, ...updates, lastUpdatedAt: new Date().toISOString() }
          : p
      );
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return { processes: updatedProcesses };
    }),

  updateProcessStatus: (processId, status) =>
    set((state) => {
      // Find the process to get its current status and name
      const process = state.processes.find((p) => p.id === processId);
      if (!process) return state;

      // Create changelog entry
      const changelogEntry: ChangelogEntry = {
        id: `changelog-${Date.now()}-${Math.random()}`,
        itemName: process.name,
        itemType: "Process",
        oldStatus: process.status,
        newStatus: status,
        changedBy: "user-1",
        changedAt: new Date().toISOString(),
      };

      // Immutably update only status field
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? { ...p, status, lastUpdatedAt: new Date().toISOString() }
          : p
      );
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return {
        processes: updatedProcesses,
        changelog: [...state.changelog, changelogEntry],
      };
    }),

  // ===== SUBPROCESS MUTATIONS =====
  updateSubprocess: (processId, subprocessId, updates) =>
    set((state) => {
      // Navigate to nested subprocess and apply updates
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
      // Recalculate caches since subprocess data changed
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
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),

  updateSubprocessStatus: (processId, subprocessId, status) =>
    set((state) => {
      // Find the subprocess to get its current status and name
      const process = state.processes.find((p) => p.id === processId);
      const subprocess = process?.subprocesses.find(
        (sp) => sp.id === subprocessId
      );
      if (!subprocess) return state;

      // Create changelog entry
      const changelogEntry: ChangelogEntry = {
        id: `changelog-${Date.now()}-${Math.random()}`,
        itemName: subprocess.name,
        itemType: "Subprocess",
        oldStatus: subprocess.status,
        newStatus: status,
        changedBy: "user-1",
        changedAt: new Date().toISOString(),
      };

      // Navigate to nested subprocess and update only status
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
      // Recalculate caches
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
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
        changelog: [...state.changelog, changelogEntry],
      };
    }),

  // ===== TASK MUTATIONS =====
  updateTask: (processId, subprocessId, taskId, updates) =>
    set((state) => {
      // Navigate deeply to task and apply updates
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
      // Recalculate caches since task data changed
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
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),

  updateTaskStatus: (processId, subprocessId, taskId, status) =>
    set((state) => {
      // Find the task and subprocess to get current status and names
      const process = state.processes.find((p) => p.id === processId);
      const subprocess = process?.subprocesses.find(
        (sp) => sp.id === subprocessId
      );
      const task = subprocess?.tasks.find((t) => t.id === taskId);
      if (!task || !subprocess) return state;

      // Create changelog entry for task
      const taskChangelogEntry: ChangelogEntry = {
        id: `changelog-${Date.now()}-${Math.random()}`,
        itemName: task.name,
        itemType: "Task",
        oldStatus: task.status,
        newStatus: status,
        changedBy: "user-1",
        changedAt: new Date().toISOString(),
      };

      // Step 1: Update the task status
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

      // Step 2: Auto-calculate parent subprocess status based on all task statuses
      const changelogEntries: ChangelogEntry[] = [taskChangelogEntry];
      const finalProcesses = updatedProcesses.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.map((sp) => {
                if (sp.id === subprocessId) {
                  // Check all tasks in this subprocess
                  const allApproved = sp.tasks.every(
                    (t) => t.status === "Approved"
                  );
                  const anyNeedsFix = sp.tasks.some(
                    (t) => t.status === "Needs Fix"
                  );

                  // Determine subprocess status
                  let subprocessStatus: Task["status"];
                  if (allApproved) {
                    subprocessStatus = "Approved";
                  } else if (anyNeedsFix) {
                    subprocessStatus = "Needs Fix";
                  } else {
                    subprocessStatus = "Pending";
                  }

                  // Log subprocess status change if it changed
                  if (subprocessStatus !== sp.status) {
                    changelogEntries.push({
                      id: `changelog-${Date.now()}-${Math.random()}-sub`,
                      itemName: sp.name,
                      itemType: "Subprocess",
                      oldStatus: sp.status,
                      newStatus: subprocessStatus,
                      changedBy: "user-1",
                      changedAt: new Date().toISOString(),
                    });
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

      // Recalculate caches with updated data
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
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(finalProcesses)
        );
      }
      return {
        processes: finalProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
        changelog: [...state.changelog, ...changelogEntries],
      };
    }),

  // ===== COMMENT MUTATIONS =====
  addProcessComment: (processId, text, author) =>
    set((state) => {
      // Create new comment with unique ID
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random()}`,
        text,
        author,
        createdAt: new Date().toISOString(),
      };
      // Add comment to target process
      const updatedProcesses = state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              comments: [...p.comments, newComment],
              lastUpdatedAt: new Date().toISOString(),
            }
          : p
      );
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return { processes: updatedProcesses };
    }),

  addSubprocessComment: (processId, subprocessId, text, author) =>
    set((state) => {
      // Create new comment with unique ID
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random()}`,
        text,
        author,
        createdAt: new Date().toISOString(),
      };
      // Navigate to subprocess and add comment
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
      // Recalculate subprocess cache
      const subprocessesCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.map((sp) => ({
          ...sp,
          processId: p.id,
        }))
      );
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
      };
    }),

  addTaskComment: (processId, subprocessId, taskId, text, author) =>
    set((state) => {
      // Create new comment with unique ID
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random()}`,
        text,
        author,
        createdAt: new Date().toISOString(),
      };
      // Navigate to task and add comment
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
      // Recalculate task cache
      const tasksCache = updatedProcesses.flatMap((p) =>
        p.subprocesses.flatMap((sp) =>
          sp.tasks.map((t) => ({
            ...t,
            processId: p.id,
            subprocessId: sp.id,
          }))
        )
      );
      // Persist changes
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEYS.PROCESSES,
          JSON.stringify(updatedProcesses)
        );
      }
      return { processes: updatedProcesses, _tasksCache: tasksCache };
    }),
}));
