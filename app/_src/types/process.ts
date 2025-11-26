export interface Task {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface Subprocess {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  tasks: Task[];
}

export interface Process {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  subprocesses: Subprocess[];
}
