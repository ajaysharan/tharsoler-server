import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { createApp } from './app.js';
import { seedIfEmpty } from './seed.js';

async function bootstrap() {
  try {
    await connectDb();
  } catch (err) {
    console.error('\nMongoDB connect failed:', err.message);
    console.error('Start MongoDB locally, then retry. Check MONGODB_URI in .env\n');
    process.exit(1);
  }

  const seeded = await seedIfEmpty();
  if (seeded) console.log('Database seeded with demo catalog + admin user');

  const app = createApp();
  app.listen(env.port, env.host, () => {
    console.log(`THAR SOLAR API  http://${env.host}:${env.port}`);
    console.log(`Health check    http://${env.host}:${env.port}/api/health`);
  });
}

bootstrap();
