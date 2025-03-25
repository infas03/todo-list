import { Task, User } from "@/types";

export interface UserState {
  userDetails: User | null;
  isLoggedIn: boolean;
}

export interface TaskState {
  tasks: Task[];
  totalTasks: number;
  finishedTasks: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TaskInput {
  title: string;
  priority: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskInput {
  id?: string;
  title: string;
  priority: string;
  description: string;
  dueDate: string;
}
