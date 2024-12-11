import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/register', async (req, res, next) => {
    try {
        const result = await authController.register(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await authController.login(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router; 