import { Task } from "../../../core/database/models/task.model";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/create-task.dto";
import { TaskStatus, TaskPriority } from "../interfaces/task.interface";
import { FilterQuery, QueryOptions } from "mongoose";

export class TaskRepository {
  async create(taskData: CreateTaskDto & { user: string }) {
    return Task.create({
      ...taskData,
      status: taskData.status || TaskStatus.NOT_DONE,
      priority: taskData.priority || TaskPriority.MEDIUM,
      dependencies: taskData.dependencies || [],
    });
  }

  async findById(id: string) {
    return Task.findById(id);
  }

  async findByUser(
    userId: string,
    filters: { mainFilter?: string; sortOrder?: string, search?: string } = ({} = {})
  ) {
    const query: FilterQuery<typeof Task> = { user: userId };

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const sort: any = {};

    if (filters.mainFilter === "priority") {
      sort["priority"] = filters.sortOrder === "asc" ? 1 : -1;
    } else if (filters.mainFilter === "dueDate") {
      sort["dueDate"] = filters.sortOrder === "asc" ? 1 : -1;
    } else if (filters.mainFilter === "status") {
      sort["status"] = filters.sortOrder === "asc" ? 1 : -1;
    } else {
      sort["dueDate"] = filters.sortOrder === "asc" ? 1 : -1;
    }

    return Task.find(query).sort(sort);
  }

  async update(id: string, updates: UpdateTaskDto) {
    const options: QueryOptions = { new: true };

    if (updates.recurrence === null) {
      return Task.findByIdAndUpdate(
        id,
        { $unset: { recurrence: 1 }, ...updates },
        options
      );
    }

    return Task.findByIdAndUpdate(id, updates, options);
  }

  async delete(id: string) {
    return Task.findByIdAndDelete(id);
  }

  async findTasksWithDependencies(dependencyIds: string[]) {
    return Task.find({
      _id: { $in: dependencyIds },
    });
  }

  async findRecurringTasksDue(thresholdDate: Date) {
    return Task.find({
      "recurrence.nextOccurrence": { $lte: thresholdDate },
    });
  }

  async updateTaskAndDependencies(
    taskId: string,
    taskUpdates: UpdateTaskDto,
    dependencyUpdates: string[]
  ) {
    const session = await Task.startSession();
    try {
      session.startTransaction();

      const updatedTask = await Task.findByIdAndUpdate(taskId, taskUpdates, {
        new: true,
        session,
      });

      await Task.updateMany(
        { _id: { $in: dependencyUpdates } },
        { $addToSet: { dependencies: taskId } },
        { session }
      );

      await session.commitTransaction();
      return updatedTask;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
