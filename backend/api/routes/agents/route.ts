import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';
import { demoAgents } from '../../../lib/demo/data';

export async function GET() {
  try {
    const agents = await getPrisma().agent.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        capabilities: true,
        verifications: { select: { status: true, score: true, confidence: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      agents: agents.map((agent) => ({
        id: agent.externalId,
        name: agent.name,
        capabilities: agent.capabilities,
        reputation: agent.reputationScore || null,
        transactions: agent.verifications.length,
        successRate: agent.verifications.length
          ? Math.round(agent.verifications.filter((item) => item.status === 'VERIFIED').length / agent.verifications.length * 100)
          : null,
        status: agent.verifications.length ? 'verified' : 'new',
      })),
    });
  } catch (error) {
    if (process.env.DEMO_MODE === 'true') return NextResponse.json({ ok: true, mode: 'demo', agents: demoAgents });
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Unable to load agents.'] }, { status: 503 });
  }
}
