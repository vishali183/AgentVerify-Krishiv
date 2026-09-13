import { createHash } from 'crypto';

export type EvidenceItem = {
  label: string;
  value: string;
};

export function hashEvidence(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function assessEvidence(evidence: EvidenceItem[] = [], responseText: string) {
  const supported = evidence.filter((item) => {
    const haystack = responseText.toLowerCase();
    return item.value && haystack.includes(item.value.toLowerCase());
  });

  return {
    total: evidence.length,
    supported: supported.length,
    score: evidence.length === 0 ? 1 : supported.length / evidence.length,
  };
}
