import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const projectController = new ProjectController();

router.use(authenticate);

router.post('/', async (req: AuthRequest, res, next) => {
    try {
        const project = await projectController.createProject(req.user!.id, req.body);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req: AuthRequest, res, next) => {
    try {
        const projects = await projectController.getProjects(req.user!.id);
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req: AuthRequest, res, next) => {
    try {
        const project = await projectController.getProjectById(req.params.id, req.user!.id);
        res.json(project);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req: AuthRequest, res, next) => {
    try {
        const project = await projectController.updateProject(req.params.id, req.user!.id, req.body);
        res.json(project);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
    try {
        await projectController.deleteProject(req.params.id, req.user!.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router; 