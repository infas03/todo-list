import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto, updateUserDto } from '../interfaces/auth.interface';
import { comparePassword } from '../../../core/utils/password';
import { signToken } from '../../../core/utils/jwt';

jest.mock('../../../core/utils/password');
jest.mock('../../../core/utils/jwt');
jest.mock('../repositories/user.repository');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService(mockUserRepo);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        ...registerData,
      };

      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(mockUser as any);

      const result = await authService.register(registerData);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(mockUserRepo.create).toHaveBeenCalledWith(registerData);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      const registerData: RegisterDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockUserRepo.findByEmail.mockResolvedValue({} as any);

      await expect(authService.register(registerData))
        .rejects
        .toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (signToken as jest.Mock).mockReturnValue('mockToken123');

      const result = await authService.login(loginData);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(signToken).toHaveBeenCalledWith({ userId: mockUser._id });
      expect(result).toEqual({
        user: mockUser,
        token: 'mockToken123'
      });
    });

    it('should throw error for invalid email', async () => {
      const loginData: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const loginData: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: 'user1', name: 'User One', email: 'user1@example.com' },
        { _id: 'user2', name: 'User Two', email: 'user2@example.com' }
      ];

      mockUserRepo.getAllUsers.mockResolvedValue(mockUsers as any);

      const result = await authService.getAllUsers();

      expect(mockUserRepo.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should throw error when failed to fetch users', async () => {
      mockUserRepo.getAllUsers.mockRejectedValue(new Error('Database error'));

      await expect(authService.getAllUsers())
        .rejects
        .toThrow('Failed to fetch users');
    });
  });

  describe('updateUser', () => {
    it('should update user without password', async () => {
      const userId = 'user123';
      const updateData: updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockUpdatedUser = {
        _id: userId,
        ...updateData
      };

      mockUserRepo.updateUser.mockResolvedValue(mockUpdatedUser as any);

      const result = await authService.updateUser(userId, updateData);

      expect(mockUserRepo.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should hash password when provided', async () => {
      const userId = 'user123';
      const updateData: updateUserDto = {
        email: 'test@example.com',
        name: 'Updated Name',
        password: 'newpassword'
      };

      const mockUpdatedUser = {
        _id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
      };

      mockUserRepo.updateUser.mockResolvedValue(mockUpdatedUser as any);

      const result = await authService.updateUser(userId, updateData);

      expect(mockUserRepo.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should remove empty password field', async () => {
      const userId = 'user123';
      const updateData: updateUserDto = {
        email: 'test@example.com',
        name: 'Updated Name',
        password: ''
      };

      const mockUpdatedUser = {
        _id: userId,
        email: 'test@example.com',
        name: 'Updated Name'
      };

      mockUserRepo.updateUser.mockResolvedValue(mockUpdatedUser as any);

      const result = await authService.updateUser(userId, updateData);

      expect(mockUserRepo.updateUser).toHaveBeenCalledWith(userId, {
        email: 'test@example.com',
        name: 'Updated Name'
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw error when update fails', async () => {
      const userId = 'user123';
      const updateData: updateUserDto = {
        email: 'test@example.com',
        name: 'Updated Name'
      };

      mockUserRepo.updateUser.mockRejectedValue(new Error('Database error'));

      await expect(authService.updateUser(userId, updateData))
        .rejects
        .toThrow('Failed to update user');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'user123';
      mockUserRepo.deleteUser.mockResolvedValue(true as any);

      const result = await authService.deleteUser(userId);

      expect(mockUserRepo.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should throw error when deletion fails', async () => {
      const userId = 'user123';
      mockUserRepo.deleteUser.mockRejectedValue(new Error('Database error'));

      await expect(authService.deleteUser(userId))
        .rejects
        .toThrow('Failed to delete user');
    });
  });
});