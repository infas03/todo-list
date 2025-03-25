import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  totalTasks?: number;
}

export interface AssignFormData {
  name: string;
  description: string;
  priority: string;
  dueDate: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Task {
  id?: number;
  name: string;
  description: string;
  priority: string;
  dueDate: string;
  isCompleted: boolean;
}
