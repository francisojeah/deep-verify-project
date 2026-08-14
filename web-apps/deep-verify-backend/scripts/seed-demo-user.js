/**
 * Upsert a verified demo account.
 *
 * Signup sends a verification email and the dashboard requires isVerified, so
 * without SMTP configured a fresh account can never reach a usable state. This
 * seeds one directly instead of shipping mail credentials.
 *
 *   DB_URI=... DEMO_PASSWORD=... node scripts/seed-demo-user.js
 */

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const EMAIL = process.env.DEMO_EMAIL || 'demo@deepverify.app';
const PASSWORD = process.env.DEMO_PASSWORD;
const DB_URI = process.env.DB_URI;

async function main() {
  if (!DB_URI) throw new Error('DB_URI is required');
  if (!PASSWORD) throw new Error('DEMO_PASSWORD is required');

  await mongoose.connect(DB_URI);

  const users = mongoose.connection.collection('users');
  const now = new Date();
  const result = await users.updateOne(
    { email: EMAIL },
    {
      $set: {
        firstname: 'Demo',
        lastname: 'User',
        password: await bcrypt.hash(PASSWORD, 10),
        isVerified: true,
        isBanned: false,
        roles: ['user'],
        updated_at: now,
      },
      $setOnInsert: { email: EMAIL, createdAt: now },
    },
    { upsert: true },
  );

  console.log(
    result.upsertedCount ? `Created ${EMAIL}` : `Updated existing ${EMAIL}`,
  );
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
