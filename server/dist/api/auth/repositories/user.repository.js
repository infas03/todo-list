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
exports.UserRepository = void 0;
const user_model_1 = require("../../../core/database/models/user.model");
class UserRepository {
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.User.create(userData);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.User.findOne({ email });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.User.find();
                return users;
            }
            catch (error) {
                throw new Error('Failed to retrieve users from database');
            }
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, { new: true });
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                throw new Error('Failed to update user');
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield user_model_1.User.findByIdAndDelete(userId);
                if (!deletedUser) {
                    return null;
                }
                return deletedUser;
            }
            catch (error) {
                throw new Error('Failed to delete user');
            }
        });
    }
}
exports.UserRepository = UserRepository;
