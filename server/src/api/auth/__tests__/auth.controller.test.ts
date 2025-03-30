import { Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { HttpStatus } from '../../../core/constants/httpStatus';
import { RegisterDto, LoginDto } from '../interfaces/auth.interface';

// Mock the services and repositories
jest.mock('../services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    login: jest.fn(),
    getAllUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn()
  }))
}));

jest.mock('../repositories/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({}))
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockAuthService = new AuthService(new UserRepository()) as jest.Mocked<AuthService>;
    authController = new AuthController();
    (authController as any).authService = mockAuthService;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      })
    };

    mockRequest = {
      body: {},
      params: {}
    };
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerData: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      };

      mockAuthService.register.mockResolvedValue(mockUser as any);
      mockRequest.body = registerData;

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        }
      });
    });

    it('should handle registration errors', async () => {
      const error = new Error('Email already exists');
      mockAuthService.register.mockRejectedValue(error);
      mockRequest.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseObject.message).toBe('Email already exists');
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
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      const mockResponseData = {
        user: mockUser,
        token: 'mockToken123'
      };

      mockAuthService.login.mockResolvedValue(mockResponseData as any);
      mockRequest.body = loginData;

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'User login successfully',
        data: mockResponseData
      });
    });

    it('should handle invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);
      mockRequest.body = {
        email: 'wrong@example.com',
        password: 'wrongpass'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseObject.message).toBe('Invalid credentials');
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users successfully', async () => {
      const mockUsers = [
        { _id: 'user1', name: 'User One', email: 'user1@example.com' },
        { _id: 'user2', name: 'User Two', email: 'user2@example.com' }
      ];

      mockAuthService.getAllUsers.mockResolvedValue(mockUsers as any);

      await authController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: mockUsers
      });
    });

    it('should handle errors when retrieving users', async () => {
      const error = new Error('Failed to fetch users');
      mockAuthService.getAllUsers.mockRejectedValue(error);

      await authController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(responseObject.message).toBe('Failed to fetch users');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockUpdatedUser = {
        _id: 'user123',
        ...updateData
      };

      mockAuthService.updateUser.mockResolvedValue(mockUpdatedUser as any);
      mockRequest.params = { id: 'user123' };
      mockRequest.body = updateData;

      await authController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.updateUser).toHaveBeenCalledWith('user123', updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: mockUpdatedUser
      });
    });

    it('should handle update errors', async () => {
      const error = new Error('Failed to update user');
      mockAuthService.updateUser.mockRejectedValue(error);
      mockRequest.params = { id: 'user123' };
      mockRequest.body = { name: 'New Name' };

      await authController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseObject.message).toBe('Failed to update user');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockAuthService.deleteUser.mockResolvedValue(true as any);
      mockRequest.params = { id: 'user123' };

      await authController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockAuthService.deleteUser).toHaveBeenCalledWith('user123');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        data: null
      });
    });

    it('should return 404 if user not found', async () => {
      mockAuthService.deleteUser.mockResolvedValue(false as any);
      mockRequest.params = { id: 'nonexistent' };

      await authController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(responseObject.message).toBe('User not found');
    });

    it('should handle delete errors', async () => {
      const error = new Error('Failed to delete user');
      mockAuthService.deleteUser.mockRejectedValue(error);
      mockRequest.params = { id: 'user123' };

      await authController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(responseObject.message).toBe('Failed to delete user');
    });
  });
});