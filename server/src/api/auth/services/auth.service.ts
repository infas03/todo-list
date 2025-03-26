import { UserRepository } from "../repositories/user.repository";
import {
  RegisterDto,
  LoginDto,
  updateUserDto,
} from "../interfaces/auth.interface";
import { comparePassword, hashPassword } from "../../../core/utils/password";
import { signToken } from "../../../core/utils/jwt";

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(data: RegisterDto) {
    if (await this.userRepo.findByEmail(data.email)) {
      throw new Error("Email already exists");
    }
    return this.userRepo.create(data);
  }

  async login(data: LoginDto) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = signToken({ userId: user._id });
    return { user, token };
  }

  async getAllUsers() {
    try {
      const users = await this.userRepo.getAllUsers();
      return users;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  async updateUser(userId: string, updateData: updateUserDto) {
    try {
      if (updateData.password === "") {
        delete updateData.password;
      } else if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }

      const updatedUser = await this.userRepo.updateUser(userId, updateData);
      return updatedUser;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(userId: string) {
    try {
      const deletedUser = await this.userRepo.deleteUser(userId);

      return deletedUser;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}
