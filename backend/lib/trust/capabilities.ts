import { VerificationResult } from '../verification/engine';

export const KNOWN_CAPABILITIES = [
  'Research',
  'Data Extraction',
  'Evidence Reliability',
  'Real-Time Information',
  'Financial Analysis',
  'Content Generation',
] as const;

export type Capability = (typeof KNOWN_CAPABILITIES)[number];

const capabilityTerms: Record<Capability, string[]> = {
  Research: ['research', 'investigate', 'analysis', 'sources', 'study'],
  'Data Extraction': ['extract', 'dataset', 'data', 'parse', 'table'],
  'Evidence Reliability': ['evidence', 'citation', 'proof', 'source', 'receipt'],
  'Real-Time Information': ['current', 'real-time', 'latest', 'live', 'today'],
  'Financial Analysis': ['financial', 'revenue', 'budget', 'forecast', 'cost'],
  'Content Generation': ['write', 'content', 'copy', 'article', 'generate'],
};

export function detectCapabilities(text: string): Capability[] {
  const normalized = text.toLowerCase();
  const matches = KNOWN_CAPABILITIES.filter((capability) =>
    capabilityTerms[capability].some((term) => normalized.includes(term)),
  );
  return matches.length ? matches : ['Content Generation'];
}

export function getRiskLevel(result: VerificationResult): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (result.status === 'FAILED' || result.status === 'REFUSED' || result.confidence < 55) return 'HIGH';
  if (result.status === 'PARTIAL' || result.confidence < 80) return 'MEDIUM';
  return 'LOW';
}

export function getRecommendation(result: VerificationResult): string {
  if (result.status === 'VERIFIED') return 'Safe to route similar work with standard monitoring.';
  if (result.status === 'PARTIAL') return 'Route only with additional evidence requirements and human review.';
  if (result.status === 'REFUSED') return 'Do not route until the provider can supply sufficient evidence.';
  return 'Avoid routing high-impact work until performance improves.';
}
