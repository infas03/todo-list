import { TaskService } from '../services/task.service';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/create-task.dto';
import { TaskStatus, TaskPriority } from '../interfaces/task.interface';
import { Model } from 'mongoose';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepo: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findTasksWithDependencies: jest.fn(),
      findRecurringTasksDue: jest.fn(),
      updateTaskAndDependencies: jest.fn()
    } as any;

    taskService = new TaskService(mockTaskRepo);
  });

  describe('createTask', () => {
    it('should create a task with default values', async () => {
      const taskData: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        dependencies: [],
        recurrence: undefined,
        status: TaskStatus.NOT_DONE,
        priority: TaskPriority.MEDIUM
      };

      const mockTask = {
        _id: 'task123',
        ...taskData,
        user: 'user123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTaskRepo.create.mockResolvedValue(mockTask as any);

      const result = await taskService.createTask(taskData, 'user123');

      expect(mockTaskRepo.create).toHaveBeenCalledWith({
        ...taskData,
        status: TaskStatus.NOT_DONE,
        priority: TaskPriority.MEDIUM,
        user: 'user123',
        dependencies: []
      });
      expect(result).toEqual({
        id: 'task123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.NOT_DONE,
        priority: TaskPriority.MEDIUM,
        user: 'user123',
        dependencies: [],
        dueDate: expect.any(Date),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should handle recurrence pattern', async () => {
      const dueDate = new Date();
      const taskData: CreateTaskDto = {
        title: 'Recurring Task',
        recurrence: { pattern: 'daily' },
        dueDate
      };

      const nextDate = new Date(dueDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const mockTask = {
        _id: 'task123',
        ...taskData,
        recurrence: {
          pattern: 'daily',
          nextOccurrence: nextDate
        },
        user: 'user123'
      };

      mockTaskRepo.create.mockResolvedValue(mockTask as any);

      const result = await taskService.createTask(taskData, 'user123');

      expect(result.recurrence).toEqual({
        pattern: 'daily',
        nextOccurrence: nextDate
      });
    });
  });

  describe('getUserTasks', () => {
    it('should return tasks with default sorting', async () => {
      const mockTasks = [
        { _id: 'task1', title: 'Task 1', dueDate: new Date(), user: 'user123' },
        { _id: 'task2', title: 'Task 2', dueDate: new Date(), user: 'user123' }
      ];

      mockTaskRepo.findByUser.mockResolvedValue(mockTasks as any[]);

      const result = await taskService.getUserTasks('user123', {});

      expect(mockTaskRepo.findByUser).toHaveBeenCalledWith('user123', {});
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task1');
    });

    it('should apply search filter', async () => {
      const mockTasks = [{ _id: 'task1', title: 'Important Task', user: 'user123' }];
      mockTaskRepo.findByUser.mockResolvedValue(mockTasks as any[]);

      await taskService.getUserTasks('user123', { search: 'important' });

      expect(mockTaskRepo.findByUser).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({
          search: 'important'
        })
      );
    });
  });

  describe('getTask', () => {
    it('should return task if found and authorized', async () => {
      const mockTask = {
        _id: 'task123',
        title: 'Test Task',
        user: 'user123'
      };

      mockTaskRepo.findById.mockResolvedValue(mockTask as any);

      const result = await taskService.getTask('task123', 'user123');

      expect(result).toEqual(expect.objectContaining({
        id: 'task123',
        title: 'Test Task'
      }));
    });

    it('should return null if task not found', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);

      const result = await taskService.getTask('task123', 'user123');

      expect(result).toBeNull();
    });

    it('should return null if unauthorized', async () => {
      const mockTask = {
        _id: 'task123',
        title: 'Test Task',
        user: 'otheruser'
      };

      mockTaskRepo.findById.mockResolvedValue(mockTask as any);

      const result = await taskService.getTask('task123', 'user123');

      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const existingTask = {
        _id: 'task123',
        title: 'Old Title',
        user: 'user123',
        status: TaskStatus.NOT_DONE
      };

      const updatedTask = {
        ...existingTask,
        title: 'New Title',
        status: TaskStatus.NOT_DONE
      };

      mockTaskRepo.findById.mockResolvedValue(existingTask as any);
      mockTaskRepo.update.mockResolvedValue(updatedTask as any);

      const result = await taskService.updateTask(
        'task123',
        { title: 'New Title', status: TaskStatus.NOT_DONE, dueDate: new Date() },
        'user123'
      );

      expect(result.title).toBe('New Title');
      expect(result.status).toBe(TaskStatus.NOT_DONE);
    });

    it('should validate dependencies before completing task', async () => {
      const existingTask = {
        _id: 'task123',
        user: 'user123',
        status: TaskStatus.NOT_DONE,
        dependencies: ['dep1']
      };

      mockTaskRepo.findById.mockResolvedValue(existingTask as any);
      mockTaskRepo.findTasksWithDependencies.mockResolvedValue([
        { _id: 'dep1', status: TaskStatus.NOT_DONE, user: 'user123' }
      ] as any[]);

      await expect(
        taskService.updateTask(
          'task123',
          { status: TaskStatus.DONE, dueDate: new Date() },
          'user123'
        )
      ).rejects.toThrow('Cannot complete task: dependencies not fulfilled');
    });
  });

  describe('deleteTask', () => {
    it('should delete task if no dependencies', async () => {
      const mockTask = {
        _id: 'task123',
        user: 'user123',
        dependencies: []
      };

      mockTaskRepo.findById.mockResolvedValue(mockTask as any);
      mockTaskRepo.findByUser.mockResolvedValue([]);
      mockTaskRepo.delete.mockResolvedValue({} as any);

      const result = await taskService.deleteTask('task123', 'user123');

      expect(result.success).toBe(true);
    });

    it('should prevent deletion if dependent tasks exist', async () => {
      const mockTask = {
        _id: 'task123',
        user: 'user123',
        dependencies: []
      };

      const dependentTask = {
        _id: 'task2',
        dependencies: ['task123']
      };

      mockTaskRepo.findById.mockResolvedValue(mockTask as any);
      mockTaskRepo.findByUser.mockResolvedValue([dependentTask] as any[]);

      await expect(
        taskService.deleteTask('task123', 'user123')
      ).rejects.toThrow('Cannot delete task as other tasks depend on it');
    });
  });
});