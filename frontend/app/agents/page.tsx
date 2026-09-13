'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Array<{ id: string; name: string; reputation: number | null; status: string; transactions: number }>>([]);
  const [error, setError] = useState(false);
  useEffect(() => { fetch('/api/agents').then((response) => response.json()).then((data) => { if (data.ok) setAgents(data.agents); else setError(true); }).catch(() => setError(true)); }, []);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Agent directory</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Trusted provider registry</h1>
        </div>
        {error && <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">Database unavailable. Start PostgreSQL to load agents.</div>}

        <div className="card-surface overflow-hidden rounded-2xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Specialty</th>
                <th className="px-4 py-3">Reputation</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.length ? agents.map((agent) => (
                <tr key={agent.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 font-medium text-white"><Link className="hover:text-brand-300" href={`/agents/${agent.id}`}>{agent.name}</Link></td>
                  <td className="px-4 py-3 text-slate-300">{agent.transactions} transactions</td>
                  <td className="px-4 py-3 text-slate-200">{agent.reputation ?? 'Insufficient data'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${agent.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300'}`}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              )) : <tr><td colSpan={4} className="p-6 text-slate-400">No agents have persisted verification history yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
