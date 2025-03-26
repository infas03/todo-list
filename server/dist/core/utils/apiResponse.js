"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, options) => {
    res.status(options.statusCode).json({
        success: options.success,
        statusCode: options.statusCode,
        message: options.message,
        data: options.data || null,
        meta: options.meta || undefined
    });
};
exports.sendResponse = sendResponse;
