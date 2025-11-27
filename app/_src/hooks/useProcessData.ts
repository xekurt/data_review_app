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

  const updateProcessStatus = useProcessStore(
    (state) => state.updateProcessStatus
  );
  const addProcessComment = useProcessStore((state) => state.addProcessComment);

  return {
    processes,
    selectedProcess,
    isLoading,
    error,
    setProcesses,
    setSelectedProcess,
    updateProcessStatus,
    addProcessComment,
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

  const updateSubprocessStatus = useProcessStore(
    (state) => state.updateSubprocessStatus
  );
  const addSubprocessComment = useProcessStore(
    (state) => state.addSubprocessComment
  );

  return {
    subprocesses,
    selectedSubprocess,
    setSelectedSubprocess,

    updateSubprocessStatus,
    addSubprocessComment,
  };
};

/* ===== TASK HOOK ===== */

export const useTaskData = () => {
  const tasks = useProcessStore((state) => state.getTasks());
  const selectedTask = useProcessStore((state) => state.selectedTask);
  const setSelectedTask = useProcessStore((state) => state.setSelectedTask);

  const updateTaskStatus = useProcessStore((state) => state.updateTaskStatus);
  const addTaskComment = useProcessStore((state) => state.addTaskComment);

  return {
    tasks,
    selectedTask,
    setSelectedTask,

    updateTaskStatus,
    addTaskComment,
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
