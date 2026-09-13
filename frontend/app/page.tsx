import Link from 'next/link';

const heroStats = [
  { label: 'Transactions verified', value: '12.4K' },
  { label: 'False positive rate', value: '1.8%' },
  { label: 'Average attestation confidence', value: '92%' },
];

const workflows = [
  'Requirement coverage validation',
  'Schema and evidence verification',
  'Safety, refusal, and uncertainty checks',
  'Cryptographic attestation and audit receipt',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-grid px-4 py-10 text-slate-100 md:px-8">
      <div className="page-content mx-auto max-w-7xl">
        <header className="animate-in mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="pulse-dot flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-bold text-white shadow-soft">A</div>
            <div>
              <div className="text-lg font-semibold">AgentVerify</div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Trust layer for agents</div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link className="transition-colors hover:text-white" href="/dashboard">Dashboard</Link>
            <Link className="transition-colors hover:text-white" href="/verify">Verify</Link>
            <Link className="transition-colors hover:text-white" href="/agents">Agents</Link>
            <Link className="transition-colors hover:text-white" href="/match">Match</Link>
            <Link className="transition-colors hover:text-white" href="/reputation">Reputation</Link>
            <Link className="transition-colors hover:text-white" href="/audit">Audit</Link>
            <Link className="rounded-lg border border-slate-700 px-3 py-2 transition hover:border-brand-400 hover:text-white" href="/login">Sign in</Link>
          </nav>
        </header>

        <section className="animate-in animate-delay-1 shine grid gap-8 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-soft lg:grid-cols-[1.25fr_0.75fr] lg:p-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-brand-200">
              Agent-to-agent trust infrastructure
            </div>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              Verify what the agent actually delivered.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              AgentVerify checks whether a provider met the original transaction contract, validated the evidence,
              and produced a machine-readable attestation that downstream systems can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/verify" className="rounded-xl bg-brand-600 px-5 py-3 font-medium text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-1 hover:bg-brand-500 hover:shadow-brand-500/30">Run verification</Link>
              <Link href="/dashboard" className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium text-slate-200 transition hover:-translate-y-1 hover:border-slate-500">Explore dashboard</Link>
            </div>
          </div>

          <div className="card-surface interactive-card animate-in animate-delay-2 rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Market signal</div>
                <div className="text-3xl font-bold text-white">92.4</div>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-400">Trusted</div>
            </div>
            <div className="space-y-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-700 bg-slate-950/40 p-3 transition hover:border-brand-400/50 hover:bg-brand-500/5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {workflows.map((item, index) => (
            <div key={item} className={`card-surface interactive-card animate-in shine rounded-2xl p-5 animate-delay-${index + 1}`}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-300">
                {index + 1}
              </div>
              <p className="text-base text-slate-200">{item}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
