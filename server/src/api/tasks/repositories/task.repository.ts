import { Task } from '../../../core/database/models/task.model';
import { CreateTaskDto, UpdateTaskDto } from '../interfaces/task.interface';

export class TaskRepository {
  async create(taskData: CreateTaskDto & { user: string }) {
    return Task.create(taskData);
  }

  async findById(id: string) {
    return Task.findById(id);
  }

  async findByUser(userId: string) {
    return Task.find({ user: userId });
  }

  async update(id: string, updates: UpdateTaskDto) {
    return Task.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string) {
    return Task.findByIdAndDelete(id);
  }
}