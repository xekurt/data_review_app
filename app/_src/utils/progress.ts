import type { Process, Subprocess } from "../types/process";

export interface ProgressStats {
  total: number;
  approved: number;
}

export function getSubprocessTaskProgress(
  subprocess: Subprocess
): ProgressStats {
  const total = subprocess.tasks.length;
  const approved = subprocess.tasks.filter(
    (t) => t.status === "Approved"
  ).length;
  return { total, approved };
}

export function getProcessTaskProgress(process: Process): ProgressStats {
  const total = process.subprocesses.reduce(
    (sum, sp) => sum + sp.tasks.length,
    0
  );
  const approved = process.subprocesses.reduce(
    (sum, sp) => sum + sp.tasks.filter((t) => t.status === "Approved").length,
    0
  );
  return { total, approved };
}

export function getProcessSubprocessProgress(process: Process): ProgressStats {
  const total = process.subprocesses.length;
  const approved = process.subprocesses.filter(
    (sp) => sp.status === "Approved"
  ).length;
  return { total, approved };
}
