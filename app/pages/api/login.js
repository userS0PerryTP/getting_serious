import { supabase } from '../../lib/supabaseClient';

const rateLimitMap = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const windowTime = 60 * 1000;
  const maxRequests = 10;

  const record = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > windowTime) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return false;
  } else {
    if (record.count >= maxRequests) return true;
    record.count += 1;
    rateLimitMap.set(ip, record);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests, try again later.' });
  }

  const { email, password, captchaToken } = req.body;

  if (!email || !password || !captchaToken) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Verify CAPTCHA
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`;

  try {
    const captchaResponse = await fetch(verifyUrl, { method: 'POST' });
    const captchaResult = await captchaResponse.json();

    if (!captchaResult.success) {
      return res.status(400).json({ error: 'Captcha verification failed' });
    }

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(400).json({ error: error?.message || 'Invalid credentials' });
    }

    // TODO: Insert audit log for login here

    res.status(200).json({ message: 'Login successful', user: data.user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
