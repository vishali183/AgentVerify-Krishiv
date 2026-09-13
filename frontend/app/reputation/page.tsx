'use client';
import { useEffect, useState } from 'react';

export default function ReputationPage() {
  const [reputation, setReputation] = useState<Array<{ name: string; score: number | null; trend: string }>>([]);
  useEffect(() => { fetch('/api/reputation').then((response) => response.json()).then((data) => { if (data.ok) setReputation(data.reputation.map((item: { name: string; score: number | null; trend: string }) => ({ name: item.name, score: item.score, trend: item.trend }))); }); }, []);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Reputation</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Provider trust scores</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reputation.length ? reputation.map((provider) => (
            <div key={provider.name} className="card-surface rounded-2xl p-5">
              <div className="text-slate-400">{provider.name}</div>
              <div className="mt-3 text-4xl font-bold text-white">{provider.score ?? '—'}</div>
              <div className="mt-2 text-sm text-brand-300">{provider.trend}</div>
            </div>
          )) : <div className="card-surface rounded-2xl p-6 text-slate-400">No reputation data is available yet.</div>}
        </div>
      </div>
    </main>
  );
}
