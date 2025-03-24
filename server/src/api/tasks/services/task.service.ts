import { TaskRepository } from '../repositories/task.repository';
import { 
  CreateTaskDto, 
  UpdateTaskDto,
  TaskResponse
} from '../interfaces/task.interface';

export class TaskService {
  constructor(private readonly taskRepo: TaskRepository) {}

  private toResponse(task: any): TaskResponse {
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      completed: task.completed,
      user: task.user.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  async createTask(data: CreateTaskDto, userId: string) {
    const task = await this.taskRepo.create({ ...data, user: userId });
    return this.toResponse(task);
  }

  async getUserTasks(userId: string) {
    const tasks = await this.taskRepo.findByUser(userId);
    return tasks.map(this.toResponse);
  }

  async updateTask(id: string, updates: UpdateTaskDto, userId: string) {
    const task = await this.taskRepo.update(id, updates);
    if (!task || task.user.toString() !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    return this.toResponse(task);
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.taskRepo.findById(id);
    if (!task || task.user.toString() !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    await this.taskRepo.delete(id);
    return { success: true };
  }
}