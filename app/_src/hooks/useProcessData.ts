"use client";

import { useProcessStore } from "../store/processStore";

/* ===== PROCESS HOOK ===== */

export const useProcessData = () => {
  return useProcessStore((state) => ({
    processes: state.processes,
    selectedProcess: state.selectedProcess,
    setProcesses: state.setProcesses,
    setSelectedProcess: state.setSelectedProcess,
    updateProcess: state.updateProcess,
    updateProcessStatus: state.updateProcessStatus,
  }));
};

/* ===== SUBPROCESS HOOK ===== */

export const useSubprocessData = () => {
  return useProcessStore((state) => ({
    subprocesses: state.getSubprocesses(),
    selectedSubprocess: state.selectedSubprocess,
    setSelectedSubprocess: state.setSelectedSubprocess,
    updateSubprocess: state.updateSubprocess,
    updateSubprocessStatus: state.updateSubprocessStatus,
  }));
};

/* ===== TASK HOOK ===== */

export const useTaskData = () => {
  return useProcessStore((state) => ({
    tasks: state.getTasks(),
    selectedTask: state.selectedTask,
    setSelectedTask: state.setSelectedTask,
    updateTask: state.updateTask,
    updateTaskStatus: state.updateTaskStatus,
  }));
};
