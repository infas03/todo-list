import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  _id?: number;
  name: string;
  email: string;
  role: string;
  totalTasks?: number;
}

export interface AssignFormData {
  title: string;
  priority: string;
  description: string;
  dueDate: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Task {
  _id?: string;
  title: string;
  status: string;
  description: string;
  priority: string;
  dueDate: string;
}
