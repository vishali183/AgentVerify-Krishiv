export default function ResultPage({
  searchParams,
}: {
  searchParams: { status?: string; score?: string; confidence?: string; summary?: string };
}) {
  const status = searchParams.status || 'VERIFIED';
  const score = Number(searchParams.score || 92);
  const confidence = Number(searchParams.confidence || 93);
  const summary = searchParams.summary || 'The provider satisfied the contract requirements and produced enough evidence to be considered trustworthy.';

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="card-surface rounded-3xl p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Attestation</p>
              <h1 className="mt-2 text-3xl font-bold text-white">Delivery result</h1>
            </div>
            <div className={`rounded-full px-3 py-1 text-sm font-semibold ${status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-400' : status === 'PARTIAL' ? 'bg-amber-500/15 text-amber-300' : status === 'REFUSED' ? 'bg-orange-500/15 text-orange-300' : 'bg-red-500/15 text-red-300'}`}>
              {status}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
              <div className="text-sm text-slate-400">Score</div>
              <div className="mt-2 text-4xl font-bold text-white">{score}</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
              <div className="text-sm text-slate-400">Confidence</div>
              <div className="mt-2 text-4xl font-bold text-white">{confidence}%</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 text-slate-200">
            <div className="mb-2 text-sm uppercase tracking-[0.18em] text-slate-400">Summary</div>
            <p>{summary}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
