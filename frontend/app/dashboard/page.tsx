'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState<{ kpis?: { total: number; verified: number; partial: number; averageScore: number | null; attestations: number; auditEvents: number }; recent?: Array<{ id: string; agent: string; status: string; score: number }> } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { fetch('/api/dashboard').then((response) => response.json()).then((value) => { if (value.ok) setData(value); else setError(true); }).catch(() => setError(true)); }, []);
  const kpis = data ? [
    { label: 'Total verifications', value: data.kpis?.total ?? 0, delta: `${data.kpis?.verified ?? 0} verified` },
    { label: 'Average score', value: data.kpis?.averageScore ?? '—', delta: 'Database average' },
    { label: 'Partial completions', value: data.kpis?.partial ?? 0, delta: 'Needs review' },
    { label: 'Audit receipts', value: data.kpis?.auditEvents ?? 0, delta: `${data.kpis?.attestations ?? 0} attestations` },
  ] : [];
  const recentJobs = data?.recent ?? [];
  return (
    <main className="min-h-screen bg-grid px-4 py-10 text-slate-100 md:px-8">
      <div className="page-content mx-auto max-w-7xl">
        <div className="animate-in mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Operations dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Trust and verification telemetry</h1>
          </div>
          <div className="pulse-dot rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">{data ? 'Live database' : 'Connecting…'}</div>
        </div>

        {error && <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">Database unavailable. Start PostgreSQL to load live dashboard data.</div>}
        <section className="grid gap-4 md:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card-surface interactive-card animate-in shine rounded-2xl p-5">
              <div className="text-sm text-slate-400">{kpi.label}</div>
              <div className="mt-3 text-3xl font-bold text-white">{kpi.value}</div>
              <div className="mt-2 text-sm text-emerald-400">{kpi.delta}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-surface animate-in animate-delay-2 rounded-2xl p-5">
            <h2 className="mb-4 text-xl font-semibold text-white">Recent verifications</h2>
            <div className="space-y-3">
              {recentJobs.length ? recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-slate-900">
                  <div>
                    <p className="font-medium text-white">{job.id}</p>
                    <p className="text-sm text-slate-400">{job.agent}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-300">Score {job.score}</div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${job.status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-400' : job.status === 'PARTIAL' ? 'bg-amber-500/15 text-amber-300' : 'bg-red-500/15 text-red-300'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              )) : <p className="rounded-xl border border-dashed border-slate-700 p-5 text-slate-400">No persisted verifications yet.</p>}
            </div>
          </div>

          <div className="card-surface animate-in animate-delay-3 rounded-2xl p-5">
            <h2 className="mb-4 text-xl font-semibold text-white">Risk posture</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm text-slate-300"><span>Requirement alignment</span><span>94%</span></div>
                <div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[94%] origin-left rounded-full bg-emerald-400 transition-transform duration-1000 hover:scale-x-105" /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm text-slate-300"><span>Evidence confidence</span><span>88%</span></div>
                <div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[88%] origin-left rounded-full bg-brand-500 transition-transform duration-1000 hover:scale-x-105" /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm text-slate-300"><span>Safety / refusal</span><span>97%</span></div>
                <div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[97%] origin-left rounded-full bg-amber-400 transition-transform duration-1000 hover:scale-x-105" /></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
