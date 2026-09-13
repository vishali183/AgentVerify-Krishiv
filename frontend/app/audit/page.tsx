'use client';
import { useEffect, useState } from 'react';

export default function AuditPage() {
  const [auditTrail, setAuditTrail] = useState<Array<{ id: string; actor: string; action: string; resource: string; timestamp: string; hash?: string }>>([]);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/audit').then((response) => response.json()).then((data) => { if (data.ok) setAuditTrail(data.entries); else setError(data.errors?.join(' ') || 'Unable to load audit trail.'); }).catch(() => setError('Unable to connect to the audit service.')); }, []);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Audit trail</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Machine-readable evidence ledger</h1>
        </div>
        {error && <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">{error}</div>}

        <div className="space-y-4">
          {auditTrail.length ? auditTrail.map((item) => (
            <div key={item.id} className="card-surface rounded-2xl p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-white">{item.actor}</div>
                  <div className="text-sm text-slate-400">{item.action}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.12em] text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between"><span>{item.resource}</span>{item.hash && <span className="font-mono text-xs text-slate-500">{item.hash}</span>}</div>
            </div>
          )) : <div className="card-surface rounded-2xl p-6 text-slate-400">No audit events have been recorded yet.</div>}
        </div>
      </div>
    </main>
  );
}
