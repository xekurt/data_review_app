"use client";

import { useProcessStore } from "../store/processStore";
import { useEffect } from "react";

/* ===== PROCESS HOOK ===== */

export const useProcessData = () => {
  const processes = useProcessStore((state) => state.processes);
  const selectedProcess = useProcessStore((state) => state.selectedProcess);
  const isLoading = useProcessStore((state) => state.isLoading);
  const error = useProcessStore((state) => state.error);
  const setProcesses = useProcessStore((state) => state.setProcesses);
  const setSelectedProcess = useProcessStore(
    (state) => state.setSelectedProcess
  );
  const updateProcess = useProcessStore((state) => state.updateProcess);
  const updateProcessStatus = useProcessStore(
    (state) => state.updateProcessStatus
  );

  return {
    processes,
    selectedProcess,
    isLoading,
    error,
    setProcesses,
    setSelectedProcess,
    updateProcess,
    updateProcessStatus,
  };
};

/* ===== SUBPROCESS HOOK ===== */

export const useSubprocessData = () => {
  const subprocesses = useProcessStore((state) => state.getSubprocesses());
  const selectedSubprocess = useProcessStore(
    (state) => state.selectedSubprocess
  );
  const setSelectedSubprocess = useProcessStore(
    (state) => state.setSelectedSubprocess
  );
  const updateSubprocess = useProcessStore((state) => state.updateSubprocess);
  const updateSubprocessStatus = useProcessStore(
    (state) => state.updateSubprocessStatus
  );

  return {
    subprocesses,
    selectedSubprocess,
    setSelectedSubprocess,
    updateSubprocess,
    updateSubprocessStatus,
  };
};

/* ===== TASK HOOK ===== */

export const useTaskData = () => {
  const tasks = useProcessStore((state) => state.getTasks());
  const selectedTask = useProcessStore((state) => state.selectedTask);
  const setSelectedTask = useProcessStore((state) => state.setSelectedTask);
  const updateTask = useProcessStore((state) => state.updateTask);
  const updateTaskStatus = useProcessStore((state) => state.updateTaskStatus);

  return {
    tasks,
    selectedTask,
    setSelectedTask,
    updateTask,
    updateTaskStatus,
  };
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
