export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    roles: string;
  };
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