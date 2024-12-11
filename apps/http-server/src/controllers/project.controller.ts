import { db, projects, eq } from '@repo/database';
import { AppError } from '../middleware/error.middleware';

export class ProjectController {
    async createProject(userId: string, data: {
        name: string;
        language: string;
        description?: string;
        isPublic?: boolean;
        configuration?: Record<string, any>;
        templateId?: string;
    }) {
        try {
            // TODO: validate data
            const project = await db.insert(projects)
                .values({
                    userId,
                    ...data
                })
                .returning();

            return project[0];

            // TODO: create workspace
            // TODO: copy template from s3/r2 to workspace

        } catch (error) {
            throw new AppError('Failed to create project', 500);
        }
    }

    async getProjects(userId: string) {
        try {
            // TODO: validate userId
            // TODO: validate user exists
            return await db.select()
                .from(projects)
                .where(eq(projects.userId, userId));

            // TODO: get workspaces from s3/r2

        } catch (error) {
            throw new AppError('Failed to fetch projects', 500);
        }
    }

    async getProjectById(projectId: string, userId: string) {
        try {
            const project = await db.select()
                .from(projects)
                .where(eq(projects.id, projectId))
                .limit(1);

            if (!project[0]) {
                throw new AppError('Project not found', 404);
            }

            if (project[0].userId !== userId && !project[0].isPublic) {
                throw new AppError('Unauthorized access', 403);
            }

            // TODO: get workspace from s3/r2

            return project[0];
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch project', 500);
        }
    }

    async updateProject(projectId: string, userId: string, data: Partial<{
        name: string;
        description: string;
        isPublic: boolean;
        configuration: Record<string, any>;
    }>) {
        try {
            const updated = await db.update(projects)
                .set(data)
                .where(eq(projects.id, projectId))
                .returning();

            return updated[0];
        } catch (error) {
            throw new AppError('Failed to update project', 500);
        }
    }

    async deleteProject(projectId: string, userId: string) {
        try {
            await db.delete(projects)
                .where(eq(projects.id, projectId));
            return true;
        } catch (error) {
            throw new AppError('Failed to delete project', 500);
        }
    }
} 