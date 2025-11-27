export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface ChangelogEntry {
  id: string;
  itemName: string;
  itemType: "Process" | "Subprocess" | "Task";
  oldStatus: "Pending" | "Approved" | "Needs Fix";
  newStatus: "Pending" | "Approved" | "Needs Fix";
  changedBy: string;
  changedAt: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  comments: Comment[];
}

export interface Subprocess {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  tasks: Task[];
  comments: Comment[];
}

export interface Process {
  id: string;
  name: string;
  description: string;
  status: "Pending" | "Approved" | "Needs Fix";
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  subprocesses: Subprocess[];
  comments: Comment[];
}
