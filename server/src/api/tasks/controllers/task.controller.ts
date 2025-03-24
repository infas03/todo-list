import { NextFunction, Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/create-task.dto';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService(new TaskRepository());
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
      
      const task = await this.taskService.createTask(
        req.body as CreateTaskDto, 
        req.user.id
      );
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const tasks = await this.taskService.getUserTasks(req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const task = await this.taskService.updateTask(
        req.params.id,
        req.body as UpdateTaskDto,
        req.user.id
      );
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const result = await this.taskService.deleteTask(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}