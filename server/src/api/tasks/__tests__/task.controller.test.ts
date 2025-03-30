import { Request, Response } from 'express';
import { TaskController } from '../controllers/task.controller';
import { HttpStatus } from '../../../core/constants/httpStatus';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskStatus, TaskPriority } from '../interfaces/task.interface';

jest.mock('../services/task.service', () => ({
  TaskService: jest.fn().mockImplementation(() => ({
    createTask: jest.fn(),
    getTask: jest.fn(),
    getUserTasks: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  }))
}));

jest.mock('../repositories/task.repository', () => ({
  TaskRepository: jest.fn().mockImplementation(() => ({}))
}));

describe('TaskController', () => {
  let controller: TaskController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    controller = new TaskController();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      })
    };

    mockRequest = {
      user: { id: 'user123' },
      body: {},
      params: { id: 'task123' }
    };
  });

  describe('createTask', () => {
    it('should successfully create a task', async () => {
      const taskData: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        status: TaskStatus.NOT_DONE,
        priority: TaskPriority.MEDIUM
      };

      const mockTask = {
        id: 'task123',
        ...taskData,
        user: 'user123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (controller as any).taskService.createTask.mockResolvedValue(mockTask);
      mockRequest.body = taskData;

      await controller.createTask(mockRequest as Request, mockResponse as Response);

      expect((controller as any).taskService.createTask).toHaveBeenCalledWith(
        taskData,
        'user123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully',
        data: mockTask
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      await controller.createTask(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('getTask', () => {
    it('should successfully retrieve a task', async () => {
      const mockTask = {
        id: 'task123',
        title: 'Test Task',
        user: 'user123',
        status: TaskStatus.NOT_DONE,
        createdAt: new Date()
      };

      (controller as any).taskService.getTask.mockResolvedValue(mockTask);

      await controller.getTask(mockRequest as Request, mockResponse as Response);

      expect((controller as any).taskService.getTask).toHaveBeenCalledWith(
        'task123',
        'user123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseObject).toEqual({
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Task retrieved successfully',
        data: mockTask
      });
    });

    it('should return 404 if task not found', async () => {
      (controller as any).taskService.getTask.mockResolvedValue(null);

      await controller.getTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(responseObject).toEqual({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Task not found',
        data: null
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (controller as any).taskService.getTask.mockRejectedValue(error);

      await controller.getTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(responseObject.message).toBe('Database error');
    });
  });
});