import { NextResponse } from 'next/server';
import { createAttestationHash } from '../../../lib/hashing';
import { getPrisma } from '../../../lib/persistence/prisma';

export async function GET(_request: Request, context: { params: { id: string } }) {
  const attestation = await getPrisma().attestation.findUnique({
    where: { id: context.params.id },
    include: { verification: { include: { requirements: true, evidence: true } } },
  });
  if (!attestation) return NextResponse.json({ ok: false, errors: ['Attestation not found.'] }, { status: 404 });
  return NextResponse.json({ ok: true, attestation });
}

export async function POST(_request: Request, context: { params: { id: string } }) {
  const attestation = await getPrisma().attestation.findUnique({ where: { id: context.params.id }, include: { verification: true } });
  if (!attestation) return NextResponse.json({ ok: false, errors: ['Attestation not found.'] }, { status: 404 });
  const expected = createAttestationHash({
    agentId: attestation.agentId,
    taskId: attestation.taskId,
    status: attestation.status,
    score: attestation.score,
    confidence: attestation.confidence,
  });
  return NextResponse.json({ ok: true, valid: expected === attestation.issueHash, status: expected === attestation.issueHash ? 'VALID' : 'TAMPERED' });
}
