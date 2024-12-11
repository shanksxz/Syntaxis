import { db, templates, eq } from '@repo/database';
import { AppError } from '../middleware/error.middleware';

export class TemplateController {
    async getTemplates() {
        try {
            return await db.select().from(templates);
        } catch (error) {
            throw new AppError('Failed to fetch templates', 500);
        }
    }

    async getTemplateById(id: string) {
        try {
            const template = await db.select()
                .from(templates)
                .where(eq(templates.id, id))
                .limit(1);

            if (!template[0]) {
                throw new AppError('Template not found', 404);
            }

            return template[0];
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch template', 500);
        }
    }
} 