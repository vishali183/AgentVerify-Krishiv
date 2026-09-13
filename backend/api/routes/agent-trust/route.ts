import { NextResponse } from 'next/server';
import { getAgentTrust } from '../../../lib/trust/analytics';
import { demoAgents } from '../../../lib/demo/data';

export async function GET(_request: Request, context: { params: { id: string } }) {
  try {
    const trust = await getAgentTrust(context.params.id);
    if (trust) return NextResponse.json({ ok: true, mode: 'database', ...trust });
  } catch (error) {
    if (process.env.DEMO_MODE !== 'true') {
      return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Unable to load trust profile.'] }, { status: 503 });
    }
  }

  if (process.env.DEMO_MODE === 'true') {
    const agent = demoAgents.find((item) => item.id === context.params.id);
    if (agent) {
      return NextResponse.json({
        ok: true,
        mode: 'demo',
        agent: { id: agent.id, name: agent.name },
        overall: { score: agent.reputation, transactions: agent.transactions, successRate: agent.successRate, trend: 'STABLE' },
        capabilities: agent.capabilities.map((capability) => ({
          capability,
          sufficientData: true,
          score: agent.reputation,
          transactions: agent.transactions,
          successRate: agent.successRate,
          confidence: agent.successRate,
          trend: 'STABLE',
        })),
      });
    }
  }

  return NextResponse.json({ ok: false, errors: ['Agent not found.'] }, { status: 404 });
}
