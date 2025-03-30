import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { TaskRepository } from "../repositories/task.repository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/create-task.dto";
import { HttpStatus } from "../../../core/constants/httpStatus";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService(new TaskRepository());
  }

  private sendResponse(
    res: Response,
    options: {
      success: boolean;
      statusCode: number;
      message: string;
      data?: any;
      meta?: any;
    }
  ) {
    res.status(options.statusCode).json({
      success: options.success,
      statusCode: options.statusCode,
      message: options.message,
      data: options.data || null,
      meta: options.meta || undefined,
    });
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        this.sendResponse(res, {
          success: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Unauthorized",
        });
        return;
      }

      const task = await this.taskService.createTask(
        req.body as CreateTaskDto,
        req.user.id
      );

      this.sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      this.sendResponse(res, {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: (error as Error).message,
      });
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const mainFilter = req.query.mainFilter?.toString() || 'dueDate';
      const sortOrder = req.query.sortOrder?.toString() || 'asc';
      const search = req.query.search?.toString();

      const filters = {
        mainFilter,
        sortOrder,
        ...(search && { search })
      };

      const tasks = await this.taskService.getUserTasks(req.user.id, filters);

      this.sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Tasks retrieved successfully",
        data: tasks,
      });
    } catch (error) {
      this.sendResponse(res, {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
      });
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.getTask(req.params.id, req.user.id);

      if (!task) {
        this.sendResponse(res, {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: "Task not found",
        });
        return;
      }

      this.sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Task retrieved successfully",
        data: task,
      });
    } catch (error) {
      this.sendResponse(res, {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
      });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.updateTask(
        req.params.id,
        req.body as UpdateTaskDto,
        req.user.id
      );

      this.sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      this.sendResponse(res, {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: (error as Error).message,
      });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      await this.taskService.deleteTask(req.params.id, req.user.id);

      this.sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Task deleted successfully",
      });
    } catch (error: any) {
      this.sendResponse(res, {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
