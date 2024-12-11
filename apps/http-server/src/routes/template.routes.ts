import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const templateController = new TemplateController();

router.use(authenticate);

router.get('/', async (req, res, next) => {
    try {
        const templates = await templateController.getTemplates();
        res.json(templates);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const template = await templateController.getTemplateById(req.params.id);
        res.json(template);
    } catch (error) {
        next(error);
    }
});

export default router; 