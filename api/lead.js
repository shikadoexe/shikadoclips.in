import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, email, message, plan } = req.body;

  const { error } = await supabase
    .from('leads')
    .insert([
      {
        name,
        email,
        message,
        plan_interest: plan,
        source: 'website'
      }
    ]);

  if (error) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).json({ success: true });
}

