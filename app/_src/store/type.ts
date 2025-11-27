import type {
  Process,
  Subprocess,
  Task,
  ChangelogEntry,
} from "../types/process";

export interface ProcessStore {
  processes: Process[];
  selectedProcess: Process | null;
  selectedSubprocess: (Subprocess & { processId: string }) | null;
  selectedTask: (Task & { processId: string; subprocessId: string }) | null;
  isLoading: boolean;
  error: string | null;
  _subprocessesCache: (Subprocess & { processId: string })[] | null;
  _tasksCache: (Task & { processId: string; subprocessId: string })[] | null;
  changelog: ChangelogEntry[];

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
  getChangelog: () => ChangelogEntry[];

  updateProcessStatus: (processId: string, status: Process["status"]) => void;

  updateSubprocessStatus: (
    processId: string,
    subprocessId: string,
    status: Subprocess["status"]
  ) => void;

  updateTaskStatus: (
    processId: string,
    subprocessId: string,
    taskId: string,
    status: Task["status"]
  ) => void;

  addProcessComment: (processId: string, text: string, author: string) => void;
  addSubprocessComment: (
    processId: string,
    subprocessId: string,
    text: string,
    author: string
  ) => void;
  addTaskComment: (
    processId: string,
    subprocessId: string,
    taskId: string,
    text: string,
    author: string
  ) => void;
}
