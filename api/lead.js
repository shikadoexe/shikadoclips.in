import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    console.log('STEP 1: Request received');

    if (req.method !== 'POST') {
      console.log('STEP 1.5: Wrong method');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('STEP 2: Creating Supabase client');

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    console.log('STEP 3: Parsing body');

    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;

    console.log('BODY:', body);

    const { name, email, message, plan } = body;

    console.log('STEP 4: Inserting into Supabase');

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
      console.error('SUPABASE ERROR:', error);
      return res.status(500).json({
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }

    console.log('STEP 6: Success');
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('CRASHED HERE:', err);
    return res.status(500).json({
      error: 'Server crash',
      message: err.message,
      stack: err.stack
    });
  }
}
