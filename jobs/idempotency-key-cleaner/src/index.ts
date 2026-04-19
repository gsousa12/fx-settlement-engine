import { db } from '@fx-settlement-engine/db';
import cron from 'node-cron';

async function cleanExpiredKeys(): Promise<void> {
  const result = await db.$client.query<{ id: string }>(
    `DELETE FROM idempotency_keys WHERE expires_at < NOW() RETURNING id`,
  );

  if (result.rowCount && result.rowCount > 0) {
    console.log(`[${new Date().toISOString()}] Deleted ${result.rowCount} expired idempotency key(s)`);
  }
}

// runs every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Idempotency key cleaner started`);

  try {
    await cleanExpiredKeys();
  } catch (err) {
    console.error('Failed to clean expired keys:', err);
  }
});
