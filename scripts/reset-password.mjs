import { createClient } from '@supabase/supabase-js';

// Usage: node --env-file=.env.local scripts/reset-password.mjs <userId> <newPassword>
const [userId, newPassword] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!userId || !newPassword) {
  console.error('Usage: node --env-file=.env.local scripts/reset-password.mjs <userId> <newPassword>');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

supabase.auth.admin.updateUserById(userId, { password: newPassword })
  .then((r) => {
    console.log('Result:', JSON.stringify(r, { depth: null }));
  })
  .catch((e) => console.log('Error:', e.message));
