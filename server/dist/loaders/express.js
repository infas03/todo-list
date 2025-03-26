"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExpressApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const config_1 = require("../core/config");
const loadExpressApp = () => {
    var _a;
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: (_a = config_1.config.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(','),
        credentials: true
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    if (config_1.config.NODE_ENV !== 'test') {
        app.use((0, morgan_1.default)('dev'));
    }
    app.get('/', (_, res) => {
        res.status(200).send('Server is running');
    });
    app.get('/health', (_, res) => {
        res.status(200).send('OK');
    });
    return app;
};
exports.loadExpressApp = loadExpressApp;
