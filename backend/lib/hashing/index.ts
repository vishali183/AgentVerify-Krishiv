import { createHash } from 'crypto';

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function createAttestationHash(payload: Record<string, unknown>): string {
  return sha256(JSON.stringify(payload));
}
