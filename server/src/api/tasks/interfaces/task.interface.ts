import { Document, Types } from 'mongoose';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  NOT_DONE = 'not_done',
  DONE = 'done'
}

export interface Recurrence {
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  nextOccurrence: Date;
  isGeneratedInstance?: boolean;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  recurrence?: Recurrence;
  dependencies: Types.ObjectId[];
  user: Types.ObjectId;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  recurrence?: Recurrence;
  dependencies: string[];
  user: string;
  createdAt: Date;
  updatedAt: Date;
}