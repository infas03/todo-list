"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_interface_1 = require("../interfaces/task.interface");
class TaskService {
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    toResponse(task) {
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
            updatedAt: task.updatedAt,
        };
    }
    createTask(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskData = Object.assign(Object.assign({}, data), { status: data.status || task_interface_1.TaskStatus.NOT_DONE, priority: data.priority || task_interface_1.TaskPriority.MEDIUM, user: userId, dependencies: data.dependencies || [] });
            if (data.recurrence) {
                taskData.recurrence = {
                    pattern: data.recurrence.pattern,
                    nextOccurrence: this.calculateNextOccurrence({
                        pattern: data.recurrence.pattern,
                        startDate: data.dueDate || new Date()
                    }),
                };
            }
            const task = yield this.taskRepo.create(taskData);
            return this.toResponse(task);
        });
    }
    getUserTasks(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, filters = {}) {
            const tasks = yield this.taskRepo.findByUser(userId, filters);
            return tasks.map(this.toResponse);
        });
    }
    getTask(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepo.findById(id);
            if (!task || task.user.toString() !== userId) {
                return null;
            }
            return this.toResponse(task);
        });
    }
    updateTask(id, updates, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const existingTask = yield this.taskRepo.findById(id);
            if (!existingTask || existingTask.user.toString() !== userId) {
                throw new Error("Task not found or unauthorized");
            }
            if (updates.status === task_interface_1.TaskStatus.DONE) {
                yield this.validateTaskCompletion(id, userId);
                if ((_a = existingTask.recurrence) === null || _a === void 0 ? void 0 : _a.pattern) {
                    const nextTask = Object.assign(Object.assign({}, existingTask.toObject()), { _id: undefined, status: task_interface_1.TaskStatus.NOT_DONE, dueDate: this.calculateNextOccurrence({
                            pattern: existingTask.recurrence.pattern,
                            startDate: existingTask.dueDate
                        }), dependencies: existingTask.dependencies.map(dep => dep.toString()), user: userId });
                    yield this.taskRepo.create(nextTask);
                }
            }
            if ((_b = updates.recurrence) === null || _b === void 0 ? void 0 : _b.pattern) {
                updates.recurrence.nextOccurrence = this.calculateNextOccurrence({
                    pattern: updates.recurrence.pattern,
                    startDate: existingTask.dueDate
                });
            }
            const task = yield this.taskRepo.update(id, updates);
            return this.toResponse(task);
        });
    }
    deleteTask(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepo.findById(id);
            if (!task || task.user.toString() !== userId) {
                throw new Error("Task not found or unauthorized");
            }
            const allUserTasks = yield this.taskRepo.findByUser(userId);
            const dependentTasks = allUserTasks.filter((t) => { var _a; return (_a = t.dependencies) === null || _a === void 0 ? void 0 : _a.includes(id); });
            if (dependentTasks.length > 0) {
                throw new Error("Cannot delete task as other tasks depend on it");
            }
            yield this.taskRepo.delete(id);
            return { success: true };
        });
    }
    handleRecurringTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const recurringTasks = yield this.taskRepo.findRecurringTasksDue(now);
            for (const task of recurringTasks) {
                const taskObj = task;
                if (taskObj.user.toString() !== userId)
                    continue;
                const newTaskData = Object.assign(Object.assign({}, task.toObject()), { title: taskObj.title, description: taskObj.description, status: task_interface_1.TaskStatus.NOT_DONE, priority: taskObj.priority, dueDate: taskObj.dueDate, dependencies: taskObj.dependencies || [], user: taskObj.user, recurrence: {
                        pattern: taskObj.recurrence.pattern,
                        nextOccurrence: this.calculateNextOccurrence(taskObj.recurrence),
                    } });
                const newTask = yield this.taskRepo.create(newTaskData);
                yield this.taskRepo.update(taskObj._id, {
                    recurrence: Object.assign(Object.assign({}, taskObj.recurrence), { nextOccurrence: this.calculateNextOccurrence(taskObj.recurrence) }),
                });
            }
        });
    }
    validateTaskCompletion(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepo.findById(taskId);
            if (!task)
                throw new Error("Task not found");
            const dependencyIds = task.dependencies.map((id) => id.toString());
            if (task.dependencies.length > 0) {
                const dependencies = yield this.taskRepo.findTasksWithDependencies(dependencyIds);
                const incompleteDependencies = dependencies.filter((dep) => dep.status !== task_interface_1.TaskStatus.DONE && dep.user.toString() === userId);
                if (incompleteDependencies.length > 0) {
                    throw new Error("Cannot complete task: dependencies not fulfilled");
                }
            }
        });
    }
    // private async createNextRecurrence(task: TaskResponse) {
    //   const nextTask = {
    //     ...task,
    //     dueDate: this.calculateNextDate(task.recurrence!.pattern),
    //     status: TaskStatus.NOT_DONE,
    //     recurrence: {
    //       pattern: task.recurrence!.pattern,
    //       nextOccurrence: this.calculateNextDate(task.recurrence!.pattern),
    //     },
    //   };
    //   await this.taskRepo.create(nextTask);
    // }
    calculateNextOccurrence(recurrence) {
        const nextDate = new Date(recurrence.startDate);
        switch (recurrence.pattern) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                if (nextDate.getMonth() !== (recurrence.startDate.getMonth() + 1) % 12) {
                    nextDate.setDate(0);
                }
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }
        return nextDate;
    }
    updateTaskWithDependencies(taskId, taskUpdates, newDependencies, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTask = yield this.taskRepo.findById(taskId);
            if (!existingTask || existingTask.user.toString() !== userId) {
                throw new Error("Task not found or unauthorized");
            }
            // Validate completion if marking as done
            if (taskUpdates.status === task_interface_1.TaskStatus.DONE) {
                yield this.validateTaskCompletion(taskId, userId);
            }
            // Update task and dependencies in transaction
            const updatedTask = yield this.taskRepo.updateTaskAndDependencies(taskId, taskUpdates, newDependencies);
            return this.toResponse(updatedTask);
        });
    }
}
exports.TaskService = TaskService;
