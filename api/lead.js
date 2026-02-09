import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    console.log('STEP 1: Function hit');

    if (req.method !== 'POST') {
      console.log('STEP 1.5: Wrong method');
      return res.status(405).end();
    }

    console.log('STEP 2: Parsing body');

    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;

    console.log('BODY RECEIVED:', body);

    const { name, email, message, plan } = body;

    console.log('STEP 3: Extracted fields:', {
      name,
      email,
      message,
      plan
    });

    if (!name || !email) {
      console.log('STEP 3.5: Missing name or email');
      return res.redirect(302, '/thanks.html?status=error');
    }

    console.log('STEP 4: Attempting insert');

    const { error } = await supabase.from('leads').insert([
      {
        name,
        email,
        message,
        plan_interest: plan,
        source: 'website'
      }
    ]);

    console.log('STEP 5: Insert attempted');

    if (error) {
      console.error('SUPABASE INSERT ERROR:', error);
      return res.redirect(302, '/thanks.html?status=error');
    }

    console.log('STEP 6: Insert successful');
    return res.redirect(302, '/thanks.html');

  } catch (err) {
    console.error('SERVER CRASH:', err);
    return res.redirect(302, '/thanks.html?status=error');
  }
}
