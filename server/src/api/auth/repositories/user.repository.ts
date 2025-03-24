import { User } from '../../../core/database/models/user.model';
import { RegisterDto } from '../interfaces/auth.interface';

export class UserRepository {
  async create(userData: RegisterDto) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }
}