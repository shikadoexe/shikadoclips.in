import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;

    const { name, email, message, plan } = body;

    const { error } = await supabase.from('leads').insert([
      {
        name,
        email,
        message,
        plan_interest: plan,
        source: 'website'
      }
    ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ crash: err.message });
  }
}
