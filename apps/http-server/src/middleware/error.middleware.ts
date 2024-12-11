import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    } else if(err instanceof z.ZodError) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    // TODO: Log error
    console.error('Unhandled error:', err);

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
}; 