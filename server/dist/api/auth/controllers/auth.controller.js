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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const user_repository_1 = require("../repositories/user.repository");
const apiResponse_1 = require("../../../core/utils/apiResponse");
const httpStatus_1 = require("../../../core/constants/httpStatus");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService(new user_repository_1.UserRepository());
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.register(req.body);
                (0, apiResponse_1.sendResponse)(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.CREATED,
                    message: 'User registered successfully',
                    data: {
                        id: user._id,
                        email: user.email,
                        name: user.name
                    }
                });
            }
            catch (error) {
                (0, apiResponse_1.sendResponse)(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.BAD_REQUEST,
                    message: error.message,
                    data: null
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('login req.body: ', req.body);
            try {
                const result = yield this.authService.login(req.body);
                (0, apiResponse_1.sendResponse)(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.CREATED,
                    message: 'User login successfully',
                    data: result
                });
            }
            catch (error) {
                (0, apiResponse_1.sendResponse)(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.BAD_REQUEST,
                    message: error.message,
                    data: null
                });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.authService.getAllUsers();
                (0, apiResponse_1.sendResponse)(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: 'Users retrieved successfully',
                    data: users
                });
            }
            catch (error) {
                (0, apiResponse_1.sendResponse)(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    data: null
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const updatedUser = yield this.authService.updateUser(id, updateData);
                (0, apiResponse_1.sendResponse)(res, {
                    success: true,
                    statusCode: httpStatus_1.HttpStatus.OK,
                    message: 'User updated successfully',
                    data: updatedUser,
                });
            }
            catch (error) {
                (0, apiResponse_1.sendResponse)(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.authService.deleteUser(id);
                if (result) {
                    (0, apiResponse_1.sendResponse)(res, {
                        success: true,
                        statusCode: httpStatus_1.HttpStatus.OK,
                        message: 'User deleted successfully',
                        data: null
                    });
                }
                else {
                    (0, apiResponse_1.sendResponse)(res, {
                        success: false,
                        statusCode: httpStatus_1.HttpStatus.NOT_FOUND,
                        message: 'User not found',
                        data: null
                    });
                }
            }
            catch (error) {
                (0, apiResponse_1.sendResponse)(res, {
                    success: false,
                    statusCode: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    data: null
                });
            }
        });
    }
}
exports.AuthController = AuthController;
