import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    console.log('STEP 1: Function invoked');

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('STEP 2: Supabase client created');

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('STEP 3: Method OK');

    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;

    console.log('STEP 4: Body parsed', body);

    const { name, email, message, plan } = body;

    console.log('STEP 5: Data extracted');

    const { error } = await supabase.from('leads').insert([
      {
        name,
        email,
        message,
        plan_interest: plan,
        source: 'website'
      }
    ]);

    console.log('STEP 6: Insert attempted');

    if (error) {
      console.error('SUPABASE ERROR:', error);
      return res.status(500).json({ error });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('CRASH:', err);
    return res.status(500).json({ crash: err.message });
  }
}
