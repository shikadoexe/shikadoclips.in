import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;

    const { name, email, message, plan, country, phone } = body;

    const { error } = await supabase.from('leads').insert([
      {
        name,
        email,
        message,
        plan_interest: plan,
        country,
        phone,
        source: 'website'
      }
    ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server crash' });
  }
}
