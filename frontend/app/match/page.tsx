'use client';

import { useState } from 'react';

type Match = { agentId: string; agentName: string; matchScore: number; capabilityTrust: number | null; evidenceReliability: number | null; riskLevel: string; reason: string };

export default function MatchPage() {
  const [task, setTask] = useState('Research the latest financial risk controls with reliable evidence.');
  const [capability, setCapability] = useState('Research');
  const [riskTolerance, setRiskTolerance] = useState('MEDIUM');
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runMatch(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task, capability, riskTolerance }) });
      const data = await response.json() as { results?: Match[]; errors?: string[] };
      if (!response.ok || data.errors?.length) {
        throw new Error(data.errors?.join(' ') || 'Matching failed. Please try again.');
      }
      setResults(data.results || []);
    } catch (requestError) {
      setResults([]);
      setError(requestError instanceof Error ? requestError.message : 'Matching failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-grid px-4 py-10 text-slate-100 md:px-8">
      <div className="page-content mx-auto max-w-6xl">
        <header className="animate-in mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Risk-aware routing</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Match the right agent to the work</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Recommendations use capability-specific history, evidence reliability, recent performance, and risk tolerance.</p>
        </header>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={runMatch} className="card-surface animate-in animate-delay-1 rounded-2xl p-5">
            <label className="block text-sm text-slate-300">Task description<textarea value={task} onChange={(event) => setTask(event.target.value)} className="mt-2 min-h-[140px] w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-brand-400" /></label>
            <label className="mt-4 block text-sm text-slate-300">Required capability<select value={capability} onChange={(event) => setCapability(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"><option>Research</option><option>Data Extraction</option><option>Evidence Reliability</option><option>Financial Analysis</option><option>Content Generation</option></select></label>
            <label className="mt-4 block text-sm text-slate-300">Risk tolerance<select value={riskTolerance} onChange={(event) => setRiskTolerance(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></label>
            <button disabled={loading} className="mt-5 rounded-xl bg-brand-600 px-5 py-3 font-medium text-white transition hover:-translate-y-1 hover:bg-brand-500 disabled:opacity-60">{loading ? 'Ranking agents…' : 'Find best match'}</button>
            {error ? <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</p> : null}
          </form>
          <section className="space-y-3">
            {results.length === 0 ? <div className="card-surface animate-in animate-delay-2 rounded-2xl border-dashed p-8 text-slate-400">Run a matching request to see explainable recommendations.</div> : results.map((match, index) => (
              <div key={match.agentId} className={`card-surface interactive-card animate-in rounded-2xl p-5 ${index === 0 ? 'border-brand-400/60 shadow-lg shadow-brand-900/20' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div><div className="text-xs uppercase tracking-[0.18em] text-slate-400">{index === 0 ? 'Recommended agent' : 'Alternative'}</div><h2 className="mt-1 text-xl font-semibold text-white">{match.agentName}</h2></div>
                  <div className="text-right"><div className="text-3xl font-bold text-brand-300">{match.matchScore}</div><div className="text-xs text-slate-400">match score</div></div>
                </div>
                <p className="mt-4 text-sm text-slate-300">{match.reason}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-slate-900 p-2"><div className="text-slate-400">Trust</div><div className="mt-1 font-semibold text-white">{match.capabilityTrust ?? 'Insufficient'}</div></div><div className="rounded-lg bg-slate-900 p-2"><div className="text-slate-400">Evidence</div><div className="mt-1 font-semibold text-white">{match.evidenceReliability ?? 'Insufficient'}</div></div><div className="rounded-lg bg-slate-900 p-2"><div className="text-slate-400">Risk</div><div className="mt-1 font-semibold text-white">{match.riskLevel}</div></div></div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
