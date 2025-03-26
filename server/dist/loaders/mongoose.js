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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../core/config");
const logger_1 = require("../core/utils/logger");
let connection;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (connection)
        return;
    try {
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.set('debug', config_1.config.NODE_ENV === 'development');
        connection = yield mongoose_1.default
            .connect(config_1.config.MONGODB_URI)
            .then(conn => conn.connection);
        logger_1.logger.info('Database connected successfully');
        connection.on('error', (error) => {
            logger_1.logger.error('MongoDB connection error:', error);
        });
        connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected');
        });
        connection.on('reconnected', () => {
            logger_1.logger.info('MongoDB reconnected');
        });
    }
    catch (error) {
        logger_1.logger.error('Database connection failed:', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!connection)
        return;
    yield mongoose_1.default.disconnect();
    logger_1.logger.info('Database disconnected');
});
exports.disconnectDB = disconnectDB;
