"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const SALT_ROUNDS = 12;
const hashPassword = (password) => (0, bcryptjs_1.hash)(password, SALT_ROUNDS);
exports.hashPassword = hashPassword;
const comparePassword = (password, hashed) => (0, bcryptjs_1.compare)(password, hashed);
exports.comparePassword = comparePassword;
