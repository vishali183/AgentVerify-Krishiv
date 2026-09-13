'use client';
import { useEffect, useState } from 'react';

export default function AttestationsPage() {
  const [attestations, setAttestations] = useState<Array<{ id: string; provider: string; status: string; hash: string }>>([]);
  useEffect(() => { fetch('/api/attestations').then((response) => response.json()).then((data) => { if (data.ok) setAttestations(data.attestations); }); }, []);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Attestations</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Cryptographic verification receipts</h1>
        </div>

        <div className="space-y-4">
          {attestations.length ? attestations.map((attestation) => (
            <div key={attestation.id} className="card-surface rounded-2xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-white">{attestation.id}</div>
                  <div className="text-sm text-slate-400">{attestation.provider}</div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${attestation.status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300'}`}>
                  {attestation.status}
                </span>
              </div>
              <div className="mt-3 break-all rounded-xl border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs text-slate-300">
                {attestation.hash}
              </div>
            </div>
          )) : <div className="card-surface rounded-2xl p-6 text-slate-400">No attestations have been generated yet.</div>}
        </div>
      </div>
    </main>
  );
}
