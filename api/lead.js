import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {

    if (req.method !== 'POST') {
  
      return res.status(405).end();
    }

    
    const body =
      typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : req.body;


    const { name, email, message, plan } = body;

 
    if (!name || !email) {
    
      return res.redirect(302, '/thanks.html?status=error');
    }

    

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
      console.error('SUPABASE INSERT ERROR:', error);
      return res.redirect(302, '/thanks.html?status=error');
    }

    
    return res.redirect(302, '/thanks.html');

  } catch (err) {
    
    return res.redirect(302, '/thanks.html?status=error');
  }
}
