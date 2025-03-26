import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  totalTasks?: number;
}

export interface Recurrence {
  pattern: string;
  startDate: string;
}

export interface AssignFormData {
  id?: string;
  title: string;
  priority: string;
  description: string;
  dueDate: string;
  recurrence: Recurrence;
}

export interface AddUserFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  description: string;
  priority: string;
  dueDate: string;
  dependencies: string[];
  recurrence?: Recurrence;
}
