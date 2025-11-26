// Type definitions based on processes.json structure
export type TaskStatus = "Pending" | "Approved" | "Needs Fix"

export interface Task {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
}

export interface Subprocess {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    tasks: Task[];
}

export interface Process {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    subprocesses: Subprocess[];
}

export interface ProcessData {
    processes: Process[];
}