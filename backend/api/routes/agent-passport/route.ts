import { NextResponse } from 'next/server';
import { createPassport } from '../../../lib/trust/analytics';

export async function GET(_request: Request, context: { params: { id: string } }) {
  const passport = await createPassport(context.params.id);
  return passport ? NextResponse.json({ ok: true, passport }) : NextResponse.json({ ok: false, errors: ['Agent not found.'] }, { status: 404 });
}
