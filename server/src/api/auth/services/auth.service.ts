import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto } from '../interfaces/auth.interface';
import { comparePassword } from '../../../core/utils/password';
import { signToken } from '../../../core/utils/jwt';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(data: RegisterDto) {
    if (await this.userRepo.findByEmail(data.email)) {
      throw new Error('Email already exists');
    }
    return this.userRepo.create(data);
  }

  async login(data: LoginDto) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = signToken({ userId: user._id });
    return { user, token };
  }
}