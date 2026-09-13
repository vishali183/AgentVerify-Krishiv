import { NextResponse } from 'next/server';
import { matchAgents } from '../../../lib/trust/analytics';
import { demoAgents } from '../../../lib/demo/data';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { task?: string; capability?: string; budget?: number; riskTolerance?: string };
    const task = body.task;
    if (!task || task.trim().length < 8) {
      return NextResponse.json({ ok: false, errors: ['Task must be at least 8 characters.'] }, { status: 400 });
    }
    try {
      return NextResponse.json({ ok: true, mode: 'database', results: await matchAgents({ ...body, task }) });
    } catch (error) {
      if (process.env.DEMO_MODE !== 'true') throw error;

      const capability = body.capability || 'Content Generation';
      const results = demoAgents.map((agent) => {
        const supportsCapability = agent.capabilities.includes(capability);
        const matchScore = supportsCapability ? agent.reputation : Math.max(45, agent.reputation - 25);
        return {
          agentId: agent.id,
          agentName: agent.name,
          matchScore,
          capabilityTrust: supportsCapability ? agent.reputation : null,
          evidenceReliability: supportsCapability ? agent.successRate : null,
          riskLevel: agent.status === 'reviewing' ? 'MEDIUM' : 'LOW',
          reason: supportsCapability
            ? `${agent.name} has ${agent.reputation}% recent ${capability} trust across ${agent.transactions} demo transactions.`
            : `${agent.name} has no persisted ${capability} history in demo mode.`,
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return NextResponse.json({ ok: true, mode: 'demo', results });
    }
  } catch (error) {
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Matching failed.'] }, { status: 500 });
  }
}
