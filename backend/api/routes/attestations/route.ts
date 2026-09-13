import { NextResponse } from 'next/server';
import { demoAttestations } from '../../../lib/demo/data';

export async function GET() {
  try {
    const { getPrisma } = await import('../../../lib/persistence/prisma');
    const attestations = await getPrisma().attestation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { verification: { include: { provider: true } } },
    });
    return NextResponse.json({
      ok: true,
      attestations: attestations.map((item) => ({
        id: item.id,
        agentId: item.agentId,
        provider: item.verification.provider?.name || item.agentId,
        status: item.status,
        score: item.score,
        confidence: item.confidence,
        hash: item.issueHash,
        createdAt: item.createdAt,
        verificationId: item.verificationId,
      })),
    });
  } catch (error) {
    if (process.env.DEMO_MODE === 'true') return NextResponse.json({ ok: true, mode: 'demo', attestations: demoAttestations });
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Unable to load attestations.'] }, { status: 503 });
  }
}
