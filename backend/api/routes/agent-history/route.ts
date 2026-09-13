import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';

export async function GET(_request: Request, context: { params: { id: string } }) {
  const agent = await getPrisma().agent.findUnique({
    where: { externalId: context.params.id },
    include: { verifications: { orderBy: { createdAt: 'desc' }, include: { attestation: true } } },
  });
  if (!agent) return NextResponse.json({ ok: false, errors: ['Agent not found.'] }, { status: 404 });
  return NextResponse.json({ ok: true, history: agent.verifications });
}
