import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().transform(Number),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    CORS_ORIGINS: z.string().transform((val) => val.split(',')),
    // optional for now
    AWS_REGION: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_ENDPOINT: z.string().optional(),
    AWS_BUCKET: z.string().optional(),
});

export const config = envSchema.parse(process.env);
