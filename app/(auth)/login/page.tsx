'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/dashboard'
    });
    if (result?.error) setError('Invalid credentials');
  }

  return (
    <main className="container" style={{ maxWidth: 480, paddingTop: '4rem' }}>
      <div className="card">
        <h2>Login</h2>
        <p>Use credentials or Google (for admin-added users).</p>
        <form onSubmit={onSubmit} className="grid">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          <button style={{ background: '#1d4ed8', color: 'white' }}>Login</button>
        </form>
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>Continue with Google</button>
      </div>
    </main>
  );
}
