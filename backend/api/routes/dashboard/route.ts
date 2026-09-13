import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';
import { demoRecent } from '../../../lib/demo/data';

export async function GET() {
  try {
    const prisma = getPrisma();
    const [total, verified, partial, failed, refused, average, attestations, audits, recent] = await Promise.all([
      prisma.verification.count(),
      prisma.verification.count({ where: { status: 'VERIFIED' } }),
      prisma.verification.count({ where: { status: 'PARTIAL' } }),
      prisma.verification.count({ where: { status: 'FAILED' } }),
      prisma.verification.count({ where: { status: 'REFUSED' } }),
      prisma.verification.aggregate({ _avg: { score: true } }),
      prisma.attestation.count(),
      prisma.auditEvent.count(),
      prisma.verification.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { provider: true } }),
    ]);
    return NextResponse.json({
      ok: true,
      kpis: {
        total,
        verified,
        partial,
        failed,
        refused,
        averageScore: average._avg.score ? Math.round(average._avg.score * 10) / 10 : null,
        attestations,
        auditEvents: audits,
      },
      recent: recent.map((item) => ({
        id: item.id,
        agent: item.provider?.name || item.providerAgentId || 'Unknown provider',
        status: item.status,
        score: item.score,
        confidence: item.confidence,
        riskLevel: item.riskLevel,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    if (process.env.DEMO_MODE === 'true') return NextResponse.json({ ok: true, mode: 'demo', kpis: { total: 2, verified: 1, partial: 1, failed: 0, refused: 0, averageScore: 84, attestations: 1, auditEvents: 1 }, recent: demoRecent });
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Unable to load dashboard.'] }, { status: 503 });
  }
}
