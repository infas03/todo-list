import { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}