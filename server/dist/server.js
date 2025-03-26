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
require("reflect-metadata");
const config_1 = require("./core/config");
const logger_1 = require("./core/utils/logger");
const express_1 = require("./loaders/express");
const mongoose_1 = require("./loaders/mongoose");
const routes_1 = __importDefault(require("./routes"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connectDB)();
    const app = (0, express_1.loadExpressApp)();
    app.use('/api', routes_1.default);
    app.listen(config_1.config.PORT, () => {
        logger_1.logger.info(`Server running on port ${config_1.config.PORT}`);
    });
});
startServer().catch(err => {
    logger_1.logger.error('Server startup failed:', err);
    process.exit(1);
});
