'use client';

import { useState } from 'react';

const defaultRequest = 'Build a customer onboarding checklist for a SaaS company, including benefits, risk controls, and a launch plan.';
const defaultResponse = 'We built the onboarding checklist with benefits, controls, and launch steps. The workflow covers acquisition, verification, and customer readiness. This is fully complete and ready to ship.';

export default function VerifyPage() {
  const [request, setRequest] = useState(defaultRequest);
  const [response, setResponse] = useState(defaultResponse);
  const [result, setResult] = useState<{
    ok: boolean;
    result?: {
      status?: string;
      score?: number;
      confidence?: number;
      summary?: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      request,
      response,
      requirements: [
        { id: 'req-1', description: 'customer onboarding checklist', required: true, weight: 3 },
        { id: 'req-2', description: 'risk controls', required: true, weight: 3 },
        { id: 'req-3', description: 'launch plan', required: true, weight: 2 },
      ],
      evidence: [
        { label: 'Checklist includes onboarding steps', value: 'onboarding checklist' },
        { label: 'Risk controls included', value: 'risk controls' },
        { label: 'Launch plan present', value: 'launch plan' },
      ],
    };

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.errors?.[0] || 'Verification could not be completed.');
      }
      setResult(json);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Verification could not be completed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-grid px-4 py-10 text-slate-100 md:px-8">
      <div className="page-content mx-auto max-w-6xl">
        <div className="animate-in mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Verification engine</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Validate agent delivery against contract requirements</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="card-surface animate-in animate-delay-1 rounded-2xl p-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">Original request</label>
            <textarea value={request} onChange={(event) => setRequest(event.target.value)} className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />

            <label className="mb-2 mt-5 block text-sm font-medium text-slate-300">Provider response</label>
            <textarea value={response} onChange={(event) => setResponse(event.target.value)} className="min-h-[160px] w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />

            <button type="submit" disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-medium text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-1 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60">
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {loading ? 'Verifying…' : 'Verify delivery'}
            </button>
            {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          </form>

          <div className="card-surface animate-in animate-delay-2 rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-white">Outcome</h2>
            {result ? (
              <div className="animate-in mt-4 space-y-4 text-sm">
                <div className="shine rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <div className="text-slate-400">Status</div>
                  <div className="mt-2 text-2xl font-bold text-white">{String(result.result?.status ?? 'UNKNOWN')}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                    <div className="text-slate-400">Score</div>
                    <div className="mt-2 text-xl font-semibold text-white">{String(result.result?.score ?? 0)}</div>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                    <div className="text-slate-400">Confidence</div>
                    <div className="mt-2 text-xl font-semibold text-white">{String(result.result?.confidence ?? 0)}%</div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-slate-200">
                  <div className="text-slate-400">Summary</div>
                  <p className="mt-2">{String(result.result?.summary ?? '')}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-slate-400">
                Submit a request and provider output to inspect the verification result.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
