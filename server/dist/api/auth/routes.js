"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./controllers/auth.controller");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/users', authController.getAllUsers.bind(authController));
router.patch('/users/:id', authController.updateUser.bind(authController));
router.delete('/users/:id', authController.deleteUser.bind(authController));
exports.default = router;
