import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get('/me', async (req: AuthRequest, res, next) => {
    try {
        const user = await userController.getCurrentUser(req.user!.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/me', async (req: AuthRequest, res, next) => {
    try {
        const user = await userController.updateUser(req.user!.id, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router; 