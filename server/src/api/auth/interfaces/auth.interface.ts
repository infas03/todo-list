import { IUser } from "../../../core/database/models/user.model";

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}