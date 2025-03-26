import { TaskRepository } from '../repositories/task.repository';
import { 
  TaskResponse,
  TaskPriority,
  TaskStatus
} from '../interfaces/task.interface';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/create-task.dto';

export class TaskService {
  constructor(private readonly taskRepo: TaskRepository) {}

  private toResponse(task: any): TaskResponse {
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      recurrence: task.recurrence,
      dependencies: task.dependencies,
      user: task.user.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  async createTask(data: CreateTaskDto, userId: string): Promise<TaskResponse> {
    const taskData = {
      ...data,
      status: data.status || TaskStatus.NOT_DONE,
      priority: data.priority || TaskPriority.MEDIUM,
      user: userId,
      dependencies: data.dependencies || []
    };

    if (data.recurrence) {
      taskData.recurrence = {
        pattern: data.recurrence.pattern,
        nextOccurrence: this.calculateNextOccurrence(data.recurrence)
      };
    }

    const task = await this.taskRepo.create(taskData);
    return this.toResponse(task);
  }

  async getUserTasks(
    userId: string, 
    filters: { mainFilter?: string; sortOrder?: string; search?: string } = {}
  ): Promise<TaskResponse[]> {
    const tasks = await this.taskRepo.findByUser(userId, filters);
    return tasks.map(this.toResponse);
  }

  async getTask(id: string, userId: string): Promise<TaskResponse | null> {
    const task = await this.taskRepo.findById(id);
    
    if (!task || task.user.toString() !== userId) {
        return null;
    }

    return this.toResponse(task);
}

  async updateTask(
    id: string, 
    updates: UpdateTaskDto, 
    userId: string
  ): Promise<TaskResponse> {
    const existingTask = await this.taskRepo.findById(id);
    if (!existingTask || existingTask.user.toString() !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    if (updates.status === TaskStatus.DONE) {
      await this.validateTaskCompletion(id, userId);
    }

    if (updates.recurrence) {
      const existingRecurrence = (existingTask as any).recurrence;

      updates.recurrence.nextOccurrence = this.calculateNextOccurrence({
        pattern: updates.recurrence.pattern!,
        nextOccurrence: existingRecurrence?.nextOccurrence,
        startDate: existingRecurrence?.nextOccurrence
      });
    }

    const task = await this.taskRepo.update(id, updates);
    return this.toResponse(task);
  }

  async deleteTask(id: string, userId: string): Promise<{ success: boolean }> {
    const task = await this.taskRepo.findById(id);
    if (!task || task.user.toString() !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    const allUserTasks = await this.taskRepo.findByUser(userId);
    const dependentTasks = allUserTasks.filter(t => 
      (t as any).dependencies?.includes(id)
    );
    
    if (dependentTasks.length > 0) {
      throw new Error('Cannot delete task as other tasks depend on it');
    }

    await this.taskRepo.delete(id);
    return { success: true };
  }

  async handleRecurringTasks(userId: string): Promise<void> {
    const now = new Date();
    const recurringTasks = await this.taskRepo.findRecurringTasksDue(now);

    for (const task of recurringTasks) {
      const taskObj = task as any;
      
      if (taskObj.user.toString() !== userId) continue;

      const newTaskData = {
        ...task.toObject(),
        title: taskObj.title,
        description: taskObj.description,
        status: TaskStatus.NOT_DONE,
        priority: taskObj.priority,
        dueDate: taskObj.dueDate,
        dependencies: taskObj.dependencies || [],
        user: taskObj.user,
        recurrence: {
          pattern: taskObj.recurrence.pattern,
          nextOccurrence: this.calculateNextOccurrence(taskObj.recurrence)
        },
      };

      const newTask = await this.taskRepo.create(newTaskData);

      await this.taskRepo.update(taskObj._id, {
        recurrence: {
          ...taskObj.recurrence,
          nextOccurrence: this.calculateNextOccurrence(taskObj.recurrence)
        }
      } as UpdateTaskDto);
    }
  }

  private async validateTaskCompletion(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new Error('Task not found');

    const dependencyIds = task.dependencies.map(id => id.toString());
    
    if (task.dependencies.length > 0) {
      const dependencies = await this.taskRepo.findTasksWithDependencies(dependencyIds);
      
      const incompleteDependencies = dependencies.filter(
        dep => dep.status !== TaskStatus.DONE && dep.user.toString() === userId
      );

      if (incompleteDependencies.length > 0) {
        throw new Error('Cannot complete task: dependencies not fulfilled');
      }
    }
  }

  private calculateNextOccurrence(recurrence: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: Date;
    nextOccurrence?: Date;
  }): Date {
    const nextDate = new Date(recurrence.nextOccurrence || recurrence.startDate || new Date());
    
    switch (recurrence.pattern) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  async updateTaskWithDependencies(
    taskId: string,
    taskUpdates: UpdateTaskDto,
    newDependencies: string[],
    userId: string
  ): Promise<TaskResponse> {
    const existingTask = await this.taskRepo.findById(taskId);
    if (!existingTask || existingTask.user.toString() !== userId) {
      throw new Error('Task not found or unauthorized');
    }

    // Validate completion if marking as done
    if (taskUpdates.status === TaskStatus.DONE) {
      await this.validateTaskCompletion(taskId, userId);
    }

    // Update task and dependencies in transaction
    const updatedTask = await this.taskRepo.updateTaskAndDependencies(
      taskId,
      taskUpdates,
      newDependencies
    );

    return this.toResponse(updatedTask);
  }
}