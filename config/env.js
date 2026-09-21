import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..');

// Prefer server/.env, then repo root .env
dotenv.config({ path: path.join(serverRoot, '.env') });
dotenv.config({ path: path.join(repoRoot, '.env') });

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  host: process.env.HOST || '127.0.0.1',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thar-solar',
  jwtSecret: process.env.JWT_SECRET || 'thar-solar-dev-secret-change-in-production',
  jwtExpires: process.env.JWT_EXPIRES || '12h',
  jwtRemember: process.env.JWT_REMEMBER || '30d',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@tharsolar.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123',
  corsOrigin: process.env.CORS_ORIGIN || true,
};
