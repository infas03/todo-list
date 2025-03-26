import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto, updateUserDto } from '../interfaces/auth.interface';
import { sendResponse } from '../../../core/utils/apiResponse';
import { HttpStatus } from '../../../core/constants/httpStatus';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new UserRepository());
  }

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body as RegisterDto);

      sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      sendResponse(res, {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: (error as Error).message,
        data: null
      });
    }
  }

  async login(req: Request, res: Response) {
    console.log('login req.body: ', req.body);
    try {
      const result = await this.authService.login(req.body as LoginDto);
      
      sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'User login successfully',
        data: result
      });
    } catch (error) {
      sendResponse(res, {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: (error as Error).message,
        data: null
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.authService.getAllUsers();
      
      sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      sendResponse(res, {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
        data: null
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body as updateUserDto;

      const updatedUser = await this.authService.updateUser(id, updateData);

      sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      sendResponse(res, {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: (error as Error).message,
        data: null,
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.authService.deleteUser(id);

      if (result) {
        sendResponse(res, {
          success: true,
          statusCode: HttpStatus.OK,
          message: 'User deleted successfully',
          data: null
        });
      } else {
        sendResponse(res, {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: null
        });
      }
    } catch (error) {
      sendResponse(res, {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
        data: null
      });
    }
  }
}