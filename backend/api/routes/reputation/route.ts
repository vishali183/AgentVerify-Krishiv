import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';
import { getAgentTrust } from '../../../lib/trust/analytics';
import { demoAgents } from '../../../lib/demo/data';

export async function GET() {
  try {
    const agents = await getPrisma().agent.findMany({ select: { externalId: true } });
    const reputation = (await Promise.all(agents.map((agent) => getAgentTrust(agent.externalId))))
      .filter((trust): trust is NonNullable<typeof trust> => Boolean(trust))
      .map((trust) => ({
        agentId: trust.agent.id,
        name: trust.agent.name,
        ...trust.overall,
        capabilities: trust.capabilities,
      }));
    return NextResponse.json({ ok: true, reputation });
  } catch (error) {
    if (process.env.DEMO_MODE === 'true') return NextResponse.json({ ok: true, mode: 'demo', reputation: demoAgents.map((agent) => ({ agentId: agent.id, name: agent.name, score: agent.reputation, transactions: agent.transactions, successRate: agent.successRate, trend: 'STABLE', capabilities: [] })) });
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Unable to load reputation.'] }, { status: 503 });
  }
}
