"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const httpStatus_1 = require("../constants/httpStatus");
const errorHandler = (err, req, res) => {
    (0, apiResponse_1.sendResponse)(res, {
        success: false,
        statusCode: httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        data: null
    });
};
exports.errorHandler = errorHandler;
