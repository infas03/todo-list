import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/users', authController.getAllUsers.bind(authController));
router.patch('/users/:id', authController.updateUser.bind(authController));
router.delete('/users/:id', authController.deleteUser.bind(authController));

export default router;