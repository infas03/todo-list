import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto } from '../interfaces/auth.interface';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new UserRepository());
  }

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body as RegisterDto);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body as LoginDto);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}