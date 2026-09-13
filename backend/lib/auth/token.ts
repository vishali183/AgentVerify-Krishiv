import { createHmac } from 'crypto';

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

function base64url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function signature(input: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'change-me-in-production') {
    throw new Error('JWT_SECRET must be configured before authentication is enabled.');
  }
  return createHmac('sha256', secret).update(input).digest('base64url');
}

export function createToken(payload: Omit<TokenPayload, 'exp'>, maxAgeSeconds = 60 * 60 * 24 * 7): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds }));
  return `${header}.${body}.${signature(`${header}.${body}`)}`;
}

export function readToken(token: string): TokenPayload | null {
  const [header, body, providedSignature] = token.split('.');
  if (!header || !body || !providedSignature) return null;
  if (signature(`${header}.${body}`) !== providedSignature) return null;

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
  return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
}
