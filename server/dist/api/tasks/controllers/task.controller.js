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
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const task_repository_1 = require("../repositories/task.repository");
const httpStatus_1 = require("../../../core/constants/httpStatus");
class TaskController {
    constructor() {
        this.taskService = new task_service_1.TaskService(new task_repository_1.TaskRepository());
    }
    sendResponse(res, options) {
        res.status(options.statusCode).json({
            success: options.success,
            statusCode: options.statusCode,
            message: options.message,
            data: options.data || null,
            meta: options.meta || undefined,
        });
    }
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("req.body: ", req.body);
            try {
                if (!req.user) {
                    this.sendResponse(res, {
                        success: false,
                        statusCode: httpStatus_1.HttpStatus.UNAUTHORIZED,
                        message: "Unauthorized",
                    });
                    return;
                }
                const task = yield this.taskService.createTask(req.body, req.user.id);
                this.sendResponse(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.CREATED,
                    message: "Task created successfully",
                    data: task,
                });
            }
            catch (error) {
                this.sendResponse(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.BAD_REQUEST,
                    message: error.message,
                });
            }
        });
    }
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const mainFilter = ((_a = req.query.mainFilter) === null || _a === void 0 ? void 0 : _a.toString()) || 'dueDate';
                const sortOrder = ((_b = req.query.sortOrder) === null || _b === void 0 ? void 0 : _b.toString()) || 'asc';
                const search = (_c = req.query.search) === null || _c === void 0 ? void 0 : _c.toString();
                const filters = Object.assign({ mainFilter,
                    sortOrder }, (search && { search }));
                const tasks = yield this.taskService.getUserTasks(req.user.id, filters);
                this.sendResponse(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: "Tasks retrieved successfully",
                    data: tasks,
                });
            }
            catch (error) {
                this.sendResponse(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                });
            }
        });
    }
    getTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield this.taskService.getTask(req.params.id, req.user.id);
                if (!task) {
                    this.sendResponse(res, {
                        success: false,
                        statusCode: httpStatus_1.HttpStatus.NOT_FOUND,
                        message: "Task not found",
                    });
                    return;
                }
                this.sendResponse(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: "Task retrieved successfully",
                    data: task,
                });
            }
            catch (error) {
                this.sendResponse(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                });
            }
        });
    }
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield this.taskService.updateTask(req.params.id, req.body, req.user.id);
                this.sendResponse(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: "Task updated successfully",
                    data: task,
                });
            }
            catch (error) {
                this.sendResponse(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.BAD_REQUEST,
                    message: error.message,
                });
            }
        });
    }
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.deleteTask(req.params.id, req.user.id);
                this.sendResponse(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: "Task deleted successfully",
                });
            }
            catch (error) {
                console.log('error delete: ', error.message);
                this.sendResponse(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.BAD_REQUEST,
                    message: error.message,
                });
            }
        });
    }
    processRecurringTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.handleRecurringTasks(req.user.id);
                this.sendResponse(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: "Recurring tasks processed successfully",
                });
            }
            catch (error) {
                this.sendResponse(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                });
            }
        });
    }
}
exports.TaskController = TaskController;
