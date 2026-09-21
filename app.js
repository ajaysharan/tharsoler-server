import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { uploadDir } from './middleware/upload.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
    const app = express();

    app.disable('x-powered-by');
    app.use(
        cors({
            origin: env.corsOrigin === 'true' ? true : env.corsOrigin,
            credentials: true
        })
    );
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use('/uploads', express.static(uploadDir));

    app.use('/api', apiRoutes);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}

export { __dirname };
