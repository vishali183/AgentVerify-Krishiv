import { NextResponse } from 'next/server';
import { getAgentTrust } from '../../../lib/trust/analytics';

export async function GET(_request: Request, context: { params: { id: string } }) {
  const trust = await getAgentTrust(context.params.id);
  if (!trust) return NextResponse.json({ ok: false, errors: ['Agent not found.'] }, { status: 404 });
  return NextResponse.json({ ok: true, agentId: context.params.id, reputation: trust.overall, capabilities: trust.capabilities });
}
