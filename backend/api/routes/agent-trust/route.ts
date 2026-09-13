import { NextResponse } from 'next/server';
import { getAgentTrust } from '../../../lib/trust/analytics';

export async function GET(_request: Request, context: { params: { id: string } }) {
  const trust = await getAgentTrust(context.params.id);
  return trust ? NextResponse.json({ ok: true, ...trust }) : NextResponse.json({ ok: false, errors: ['Agent not found.'] }, { status: 404 });
}
