import { create } from "zustand";
import { produce } from "immer";

import type { Process, Subprocess, Task } from "../types/process";
import {
  createChangelogEntry,
  createComment,
  findProcess,
  findSubprocess,
  findTask,
  persistToStorage,
  recalculateCaches,
  STORAGE_KEYS,
} from "./utils/helpers";
import type { ProcessStore } from "./utils/type";
import { useChangelogStore } from "./changelogStore";

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],
  selectedProcess: null,
  selectedSubprocess: null,
  selectedTask: null,
  isLoading: false,
  error: null,
  _subprocessesCache: null,
  _tasksCache: null,
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

  updateProcessStatus: (processId, status) =>
    set((state) => {
      const process = findProcess(state.processes, processId);
      if (!process) return state;

      const changelogEntry = createChangelogEntry(
        process.name,
        "Process",
        process.status,
        status
      );

      const updatedProcesses = produce(state.processes, (draft: Process[]) => {
        const processToUpdate = findProcess(draft, processId);
        if (processToUpdate) {
          processToUpdate.status = status;
          processToUpdate.lastUpdatedAt = new Date().toISOString();
        }
      });

      persistToStorage(updatedProcesses);
      useChangelogStore.getState().addChangelogEntry(changelogEntry);
      return {
        processes: updatedProcesses,
      };
    }),

  updateSubprocessStatus: (processId, subprocessId, status) =>
    set((state) => {
      const process = findProcess(state.processes, processId);
      const subprocess = findSubprocess(process, subprocessId);
      if (!subprocess) return state;

      const changelogEntry = createChangelogEntry(
        subprocess.name,
        "Subprocess",
        subprocess.status,
        status
      );

      const updatedProcesses = produce(state.processes, (draft) => {
        const processToUpdate = findProcess(draft, processId);
        if (processToUpdate) {
          const subprocessToUpdate = findSubprocess(
            processToUpdate,
            subprocessId
          );
          if (subprocessToUpdate) {
            subprocessToUpdate.status = status;
            subprocessToUpdate.lastUpdatedAt = new Date().toISOString();
          }
        }
      });

      const { subprocessesCache, tasksCache } =
        recalculateCaches(updatedProcesses);
      persistToStorage(updatedProcesses);
      useChangelogStore.getState().addChangelogEntry(changelogEntry);
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),

  updateTaskStatus: (processId, subprocessId, taskId, status) =>
    set((state) => {
      const process = findProcess(state.processes, processId);
      const subprocess = findSubprocess(process, subprocessId);
      const task = findTask(subprocess, taskId);
      if (!task || !subprocess) return state;

      const changelogEntries = [
        createChangelogEntry(task.name, "Task", task.status, status),
      ];

      const updatedProcesses = produce(state.processes, (draft) => {
        const processToUpdate = findProcess(draft, processId);
        if (!processToUpdate) return;

        const subprocessToUpdate = findSubprocess(
          processToUpdate,
          subprocessId
        );
        if (!subprocessToUpdate) return;

        const taskToUpdate = findTask(subprocessToUpdate, taskId);
        if (taskToUpdate) {
          taskToUpdate.status = status;
          taskToUpdate.lastUpdatedAt = new Date().toISOString();
        }

        const allApproved = subprocessToUpdate.tasks.every(
          (t: Task) => t.status === "Approved"
        );
        const anyNeedsFix = subprocessToUpdate.tasks.some(
          (t: Task) => t.status === "Needs Fix"
        );

        const subprocessStatus: Task["status"] = allApproved
          ? "Approved"
          : anyNeedsFix
          ? "Needs Fix"
          : "Pending";

        if (subprocessStatus !== subprocessToUpdate.status) {
          changelogEntries.push(
            createChangelogEntry(
              subprocessToUpdate.name,
              "Subprocess",
              subprocessToUpdate.status,
              subprocessStatus
            )
          );
          subprocessToUpdate.status = subprocessStatus;
          subprocessToUpdate.lastUpdatedAt = new Date().toISOString();
        }

        const allSubprocessesApproved = processToUpdate.subprocesses.every(
          (sp: Subprocess) => sp.status === "Approved"
        );
        const allTasksApproved = processToUpdate.subprocesses.every(
          (sp: Subprocess) => sp.tasks.every((t) => t.status === "Approved")
        );

        const newProcessStatus: Process["status"] =
          allSubprocessesApproved && allTasksApproved ? "Pending" : "Needs Fix";

        if (newProcessStatus !== processToUpdate.status) {
          changelogEntries.push(
            createChangelogEntry(
              processToUpdate.name,
              "Process",
              processToUpdate.status,
              newProcessStatus
            )
          );
          processToUpdate.status = newProcessStatus;
          processToUpdate.lastUpdatedAt = new Date().toISOString();
        }
      });

      const { subprocessesCache, tasksCache } =
        recalculateCaches(updatedProcesses);
      persistToStorage(updatedProcesses);
      useChangelogStore.getState().addChangelogEntries(changelogEntries);
      return {
        processes: updatedProcesses,
        _subprocessesCache: subprocessesCache,
        _tasksCache: tasksCache,
      };
    }),

  addProcessComment: (processId, text, author) =>
    set((state) => {
      const newComment = createComment(text, author);
      const updatedProcesses = produce(state.processes, (draft) => {
        const processToUpdate = findProcess(draft, processId);
        if (processToUpdate) {
          processToUpdate.comments.push(newComment);
          processToUpdate.lastUpdatedAt = new Date().toISOString();
        }
      });
      persistToStorage(updatedProcesses);
      return { processes: updatedProcesses };
    }),

  addSubprocessComment: (processId, subprocessId, text, author) =>
    set((state) => {
      const newComment = createComment(text, author);
      const updatedProcesses = produce(state.processes, (draft) => {
        const processToUpdate = findProcess(draft, processId);
        if (processToUpdate) {
          const subprocessToUpdate = findSubprocess(
            processToUpdate,
            subprocessId
          );
          if (subprocessToUpdate) {
            subprocessToUpdate.comments.push(newComment);
            subprocessToUpdate.lastUpdatedAt = new Date().toISOString();
          }
        }
      });
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
      const updatedProcesses = produce(state.processes, (draft) => {
        const processToUpdate = findProcess(draft, processId);
        if (processToUpdate) {
          const subprocessToUpdate = findSubprocess(
            processToUpdate,
            subprocessId
          );
          if (subprocessToUpdate) {
            const taskToUpdate = findTask(subprocessToUpdate, taskId);
            if (taskToUpdate) {
              taskToUpdate.comments.push(newComment);
              taskToUpdate.lastUpdatedAt = new Date().toISOString();
            }
          }
        }
      });
      const { tasksCache } = recalculateCaches(updatedProcesses);
      persistToStorage(updatedProcesses);
      return { processes: updatedProcesses, _tasksCache: tasksCache };
    }),
}));
