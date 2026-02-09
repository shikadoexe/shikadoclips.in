import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, plan } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase.from('leads').insert([
      {
        name,
        email,
        country,
        phone,
        message,
        plan_interest: plan,
        source: 'website'
      }
    ]);

if (error) {
  console.error('SUPABASE ERROR FULL:', error);
  return res.status(500).json({
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
}


    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
  console.log('BODY RECEIVED:', body);

}
