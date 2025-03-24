import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = (password: string) => hash(password, SALT_ROUNDS);
export const comparePassword = (password: string, hashed: string) => 
  compare(password, hashed);