import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;

    // Honeypot spam check
    if (body.company) {
      return res.redirect(302, '/thanks.html');
    }

    const { name, email, message, plan } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

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
      return res.status(500).end();
    }

    return res.redirect(302, '/thanks.html');

  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
}
