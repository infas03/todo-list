import { Router } from 'express';
import { TaskController } from './controllers/task.controller';
import { CreateTaskDto, UpdateTaskDto } from './dtos/create-task.dto';
import { authMiddleware } from '../../core/middleware/auth.middleware';
import { validate } from '../../core/middleware/validate.middleware';

const router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

router.post('/', validate(CreateTaskDto), taskController.createTask.bind(taskController));
router.get('/', taskController.getTasks.bind(taskController));
router.patch('/:id', validate(UpdateTaskDto), taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;