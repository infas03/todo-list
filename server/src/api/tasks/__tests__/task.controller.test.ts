import { Request, Response } from 'express';
import { TaskController } from '../controllers/task.controller';
import { HttpStatus } from '../../../core/constants/httpStatus';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskStatus, TaskPriority } from '../interfaces/task.interface';

jest.mock('../services/task.service', () => ({
  TaskService: jest.fn().mockImplementation(() => ({
    createTask: jest.fn()
  }))
}));

jest.mock('../repositories/task.repository', () => ({
  TaskRepository: jest.fn().mockImplementation(() => ({}))
}));

describe('TaskController - createTask', () => {
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
      body: {}
    };
  });

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
    expect(responseObject).toEqual({
      success: false,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
      data: null
    });
  });

  it('should handle validation errors', async () => {
    const error = new Error('Validation failed');
    (controller as any).taskService.createTask.mockRejectedValue(error);
    mockRequest.body = { invalid: 'data' };

    await controller.createTask(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseObject).toEqual({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      data: null
    });
  });
});