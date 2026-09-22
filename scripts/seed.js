import { connectDb } from '../config/db.js';
import { seedDatabase } from '../seed.js';

const force = process.argv.includes('--force') || process.argv.includes('--reset');

async function main() {
  await connectDb();
  const ok = await seedDatabase({ force });
  if (ok) console.log(force ? 'Database reset + seeded (ObjectId schemas)' : 'Database seeded');
  else console.log('Already seeded (pass --force to wipe & reseed)');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
