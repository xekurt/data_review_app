"use client";

import { useProcessStore } from "./processStore";
import { useEffect } from "react";

/* ===== PROCESS HOOK ===== */

export const useProcessData = () => {
  return useProcessStore((state) => ({
    processes: state.processes,
    selectedProcess: state.selectedProcess,
    isLoading: state.isLoading,
    error: state.error,
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

/* ===== INITIALIZATION HOOK ===== */

export const useInitializeProcesses = () => {
  const initializeProcesses = useProcessStore(
    (state) => state.initializeProcesses
  );

  useEffect(() => {
    initializeProcesses();
  }, [initializeProcesses]);
};
