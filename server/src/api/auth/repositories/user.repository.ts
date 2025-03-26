import { User } from '../../../core/database/models/user.model';
import { RegisterDto, updateUserDto } from '../interfaces/auth.interface';

export class UserRepository {
  async create(userData: RegisterDto) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async getAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error('Failed to retrieve users from database');
    }
  }

  async updateUser(userId: string, updateData: updateUserDto) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(userId: string) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return null;
      }

      return deletedUser;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}