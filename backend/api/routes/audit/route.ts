import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';
import { demoAudit } from '../../../lib/demo/data';

export async function GET() {
  try {
    const entries = await getPrisma().auditEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { verification: { select: { id: true, status: true, score: true } } },
    });
    return NextResponse.json({
      ok: true,
      entries: entries.map((entry) => ({
        id: entry.id,
        actor: entry.actor,
        action: entry.action,
        resource: entry.resource,
        timestamp: entry.createdAt,
        hash: entry.hash,
        verification: entry.verification,
      })),
    });
  } catch (error) {
    if (process.env.DEMO_MODE === 'true') return NextResponse.json({ ok: true, mode: 'demo', entries: demoAudit });
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Unable to load audit trail.'] }, { status: 503 });
  }
}
