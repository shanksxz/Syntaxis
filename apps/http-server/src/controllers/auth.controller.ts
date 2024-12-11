import { db, users, eq } from '@repo/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AppError } from '../middleware/error.middleware';

export class AuthController {
    async register(data: {
        username: string;
        email: string;
        password: string;
    }) {
        const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, data.email))
            .limit(1);

        if (existingUser[0]) {
            throw new AppError('Email already registered', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await db.insert(users)
            .values({
                username: data.username,
                email: data.email,
                password: hashedPassword
            })
            .returning();

        const token = jwt.sign(
            { id: newUser[0].id, email: newUser[0].email },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        return { user: newUser[0], token };
    }

    async login(data: { email: string; password: string }) {
        const user = await db.select()
            .from(users)
            .where(eq(users.email, data.email))
            .limit(1);

        if (!user[0]) {
            throw new AppError('Invalid credentials', 401);
        }

        const isValidPassword = await bcrypt.compare(
            data.password,
            user[0].password
        );

        if (!isValidPassword) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: user[0].id, email: user[0].email },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        return { user: user[0], token };
    }
} 