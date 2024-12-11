import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import templateRoutes from './routes/template.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors({
    origin: config.CORS_ORIGINS,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
}); 