import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 1️⃣ Insert into Supabase
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

    // 2️⃣ Send email notification to YOU
    await resend.emails.send({
      from: 'ShikadoClips <onboarding@resend.dev>',
      to: ['YOURPERSONALEMAIL@gmail.com'],
      subject: `New Lead — ${plan || 'Unknown Plan'}`,
      html: `
        <strong>Name:</strong> ${name}<br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Plan:</strong> ${plan}<br/>
        <strong>Message:</strong><br/>${message}
      `
    });

    // 3️⃣ Redirect user
    return res.redirect(302, '/thanks.html');

  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }

if (body.company) {
  return res.redirect(302, '/thanks.html');
}

}
