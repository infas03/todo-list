import { User } from "@/types";

export interface UserState {
  userDetails: User | null;
  isLoggedIn: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}
