'use client'

import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, captchaToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Signup failed');
    } else {
      setMessage('Signup successful! Check your email for verification.');
      setEmail('');
      setPassword('');
      setCaptchaToken(null);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Sign Up</h2>

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
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </form>
  );
}
