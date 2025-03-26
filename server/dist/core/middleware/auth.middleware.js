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
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../../core/database/models/user.model");
const api_error_1 = require("../errors/api.error");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new api_error_1.ApiError(401, "Authentication token missing");
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
            throw new api_error_1.ApiError(401, "Invalid authentication token");
        }
        const user = yield user_model_1.User.findById(decoded.userId).select("-password");
        if (!user) {
            throw new api_error_1.ApiError(404, "User not found");
        }
        req.user = Object.assign({ id: user._id.toString() }, user.toObject());
        next();
    }
    catch (error) {
        if (error instanceof api_error_1.ApiError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(401).json({ error: "Authentication failed" });
    }
});
exports.authMiddleware = authMiddleware;
