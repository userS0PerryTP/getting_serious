'use client'

import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setMessage('Please complete the CAPTCHA');
      return;
    }

    setLoading(true);
    setMessage('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, captchaToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Login failed');
    } else {
      setMessage('Login successful!');
      setEmail('');
      setPassword('');
      setCaptchaToken(null);
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>

      <label>Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <label>Password</label>
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      {/*<ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={handleCaptchaChange}
      />*/}

      <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </form>
  );
}
