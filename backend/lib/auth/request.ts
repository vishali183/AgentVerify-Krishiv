import { NextResponse } from 'next/server';
import { readToken } from './token';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export function getAuthUser(request: Request): AuthUser | null {
  const authorization = request.headers.get('authorization');
  const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  const cookieToken = request.headers.get('cookie')?.match(/agentverify_session=([^;]+)/)?.[1];
  const token = bearer || cookieToken;

  if (!token) return null;
  const payload = readToken(token);
  return payload ? { id: payload.sub, email: payload.email, role: payload.role } : null;
}

export function requireAuth(request: Request, roles?: string[]): AuthUser | NextResponse {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ ok: false, errors: ['Authentication required.'] }, { status: 401 });
  }
  if (roles && !roles.includes(user.role)) {
    return NextResponse.json({ ok: false, errors: ['You do not have permission to perform this action.'] }, { status: 403 });
  }
  return user;
}
