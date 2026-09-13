import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/persistence/prisma';
import { hashPassword, verifyPassword } from '../../../lib/auth/password';
import { createToken } from '../../../lib/auth/token';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

function validateCredentials(email: unknown, password: unknown): string | null {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'A valid email is required.';
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export async function POST(request: Request) {
  let body: { action?: string; email?: string; password?: string; name?: string } = {};
  try {
    body = await request.json() as { action?: string; email?: string; password?: string; name?: string };
    const credentialError = validateCredentials(body.email, body.password);
    if (credentialError) return NextResponse.json({ ok: false, errors: [credentialError] }, { status: 400 });

    const prisma = getPrisma();
    if (body.action === 'register') {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        return NextResponse.json({ ok: false, errors: ['Name must be at least 2 characters.'] }, { status: 400 });
      }
      const existing = await prisma.user.findUnique({ where: { email: body.email!.toLowerCase() } });
      if (existing) return NextResponse.json({ ok: false, errors: ['An account with this email already exists.'] }, { status: 409 });

      const user = await prisma.user.create({
        data: {
          email: body.email!.toLowerCase(),
          name: body.name.trim(),
          passwordHash: await hashPassword(body.password!),
        },
      });
      const token = createToken({ sub: user.id, email: user.email, role: user.role });
      const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
      response.cookies.set('agentverify_session', token, cookieOptions);
      return response;
    }

    const user = await prisma.user.findUnique({ where: { email: body.email!.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password!, user.passwordHash))) {
      return NextResponse.json({ ok: false, errors: ['Invalid email or password.'] }, { status: 401 });
    }
    const token = createToken({ sub: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    response.cookies.set('agentverify_session', token, cookieOptions);
    return response;
  } catch (error) {
    if (process.env.DEMO_MODE === 'true' && body.email && body.password) {
      const token = createToken({ sub: `demo-user-${body.email.toLowerCase()}`, email: body.email.toLowerCase(), role: 'OPERATOR' });
      const response = NextResponse.json({ ok: true, mode: 'demo', user: { id: `demo-user-${body.email.toLowerCase()}`, email: body.email.toLowerCase(), name: body.name || 'Demo Operator', role: 'OPERATOR' } });
      response.cookies.set('agentverify_session', token, cookieOptions);
      return response;
    }
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Authentication failed.'] }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization');
  const cookieToken = request.headers.get('cookie')?.match(/agentverify_session=([^;]+)/)?.[1];
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : cookieToken;
  if (!token) return NextResponse.json({ ok: false, user: null }, { status: 401 });
  try {
    const { readToken } = await import('../../../lib/auth/token');
    const payload = readToken(token);
    if (!payload) return NextResponse.json({ ok: false, user: null }, { status: 401 });
    return NextResponse.json({ ok: true, user: payload });
  } catch (error) {
    return NextResponse.json({ ok: false, errors: [error instanceof Error ? error.message : 'Authentication failed.'] }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('agentverify_session', '', { ...cookieOptions, maxAge: 0 });
  return response;
}
