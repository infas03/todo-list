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
exports.TaskRepository = void 0;
const task_model_1 = require("../../../core/database/models/task.model");
const task_interface_1 = require("../interfaces/task.interface");
class TaskRepository {
    create(taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.Task.create(Object.assign(Object.assign({}, taskData), { status: taskData.status || task_interface_1.TaskStatus.NOT_DONE, priority: taskData.priority || task_interface_1.TaskPriority.MEDIUM, dependencies: taskData.dependencies || [] }));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.Task.findById(id);
        });
    }
    findByUser(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, filters = ({} = {})) {
            const query = { user: userId };
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }
            const sort = {};
            if (filters.mainFilter === "priority") {
                sort["priority"] = filters.sortOrder === "asc" ? 1 : -1;
            }
            else if (filters.mainFilter === "dueDate") {
                sort["dueDate"] = filters.sortOrder === "asc" ? 1 : -1;
            }
            else if (filters.mainFilter === "status") {
                sort["status"] = filters.sortOrder === "asc" ? 1 : -1;
            }
            else {
                sort["dueDate"] = filters.sortOrder === "asc" ? 1 : -1;
            }
            return task_model_1.Task.find(query).sort(sort);
        });
    }
    update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { new: true };
            if (updates.recurrence === null) {
                return task_model_1.Task.findByIdAndUpdate(id, Object.assign({ $unset: { recurrence: 1 } }, updates), options);
            }
            return task_model_1.Task.findByIdAndUpdate(id, updates, options);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.Task.findByIdAndDelete(id);
        });
    }
    findTasksWithDependencies(dependencyIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.Task.find({
                _id: { $in: dependencyIds },
            });
        });
    }
    findRecurringTasksDue(thresholdDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return task_model_1.Task.find({
                "recurrence.nextOccurrence": { $lte: thresholdDate },
            });
        });
    }
    updateTaskAndDependencies(taskId, taskUpdates, dependencyUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield task_model_1.Task.startSession();
            try {
                session.startTransaction();
                const updatedTask = yield task_model_1.Task.findByIdAndUpdate(taskId, taskUpdates, {
                    new: true,
                    session,
                });
                yield task_model_1.Task.updateMany({ _id: { $in: dependencyUpdates } }, { $addToSet: { dependencies: taskId } }, { session });
                yield session.commitTransaction();
                return updatedTask;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
}
exports.TaskRepository = TaskRepository;
