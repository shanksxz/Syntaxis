import { db, users, eq } from '@repo/database';
import { AppError } from '../middleware/error.middleware';
import bcrypt from 'bcryptjs';

export class UserController {
    async getCurrentUser(userId: string) {
        try {
            const user = await db.select({
                id: users.id,
                username: users.username,
                email: users.email,
                createdAt: users.createdAt
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

            if (!user[0]) {
                throw new AppError('User not found', 404);
            }

            return user[0];
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to fetch user', 500);
        }
    }

    async updateUser(userId: string, data: { username?: string; email?: string; password?: string }) {
        try {
            const updateData: any = {};
            
            if (data.username) updateData.username = data.username;
            if (data.email) updateData.email = data.email;
            if (data.password) {
                updateData.password = await bcrypt.hash(data.password, 10);
            }

            const user = await db.update(users)
                .set(updateData)
                .where(eq(users.id, userId))
                .returning({
                    id: users.id,
                    username: users.username,
                    email: users.email,
                    createdAt: users.createdAt
                });

            return user[0];
        } catch (error) {
            throw new AppError('Failed to update user', 500);
        }
    }
} 