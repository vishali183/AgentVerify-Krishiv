'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, name, email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.errors?.[0] || 'Unable to authenticate.');
      router.push('/dashboard');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to authenticate.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-grid px-4 py-12 text-slate-100 md:px-8">
      <div className="page-content mx-auto max-w-md">
        <div className="animate-in mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 text-left">
            <span className="pulse-dot flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 font-bold text-white shadow-soft">A</span>
            <span>
              <span className="block text-lg font-semibold text-white">AgentVerify</span>
              <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Trust layer for agents</span>
            </span>
          </Link>
        </div>

        <div className="card-surface animate-in animate-delay-1 rounded-3xl p-6 shadow-soft md:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Secure access</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-2 text-sm text-slate-400">Manage verification contracts, attestations, and agent trust signals.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <label className="block text-sm text-slate-300">
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />
              </label>
            )}
            <label className="block text-sm text-slate-300">
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />
            </label>
            <label className="block text-sm text-slate-300">
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />
            </label>
            {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-medium text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-500 disabled:opacity-60">
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="mt-5 w-full text-center text-sm text-slate-400 transition hover:text-brand-300">
            {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </main>
  );
}
