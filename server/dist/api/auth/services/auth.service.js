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
exports.AuthService = void 0;
const password_1 = require("../../../core/utils/password");
const jwt_1 = require("../../../core/utils/jwt");
class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.userRepo.findByEmail(data.email)) {
                throw new Error("Email already exists");
            }
            return this.userRepo.create(data);
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByEmail(data.email);
            if (!user || !(yield (0, password_1.comparePassword)(data.password, user.password))) {
                throw new Error("Invalid credentials");
            }
            const token = (0, jwt_1.signToken)({ userId: user._id });
            return { user, token };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepo.getAllUsers();
                return users;
            }
            catch (error) {
                throw new Error("Failed to fetch users");
            }
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (updateData.password === "") {
                    delete updateData.password;
                }
                else if (updateData.password) {
                    updateData.password = yield (0, password_1.hashPassword)(updateData.password);
                }
                const updatedUser = yield this.userRepo.updateUser(userId, updateData);
                return updatedUser;
            }
            catch (error) {
                throw new Error("Failed to update user");
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield this.userRepo.deleteUser(userId);
                return deletedUser;
            }
            catch (error) {
                throw new Error('Failed to delete user');
            }
        });
    }
}
exports.AuthService = AuthService;
