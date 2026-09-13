import { Requirement } from './requirements';

export function calculateScore(metrics: {
  requirementCoverage: number;
  evidenceScore: number;
  consistencyScore: number;
  usabilityScore: number;
  safetyScore: number;
  requirementWeight: number;
  requiredCount: number;
}) {
  const weighted =
    metrics.requirementCoverage * 0.35 +
    metrics.evidenceScore * 0.2 +
    metrics.consistencyScore * 0.15 +
    metrics.usabilityScore * 0.15 +
    metrics.safetyScore * 0.15;

  const score = Math.round((weighted + metrics.requirementWeight / Math.max(metrics.requiredCount, 1) * 0.05) * 100);
  return Math.min(100, Math.max(0, score));
}

export function determineStatus(score: number, refusal: boolean): 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'REFUSED' {
  if (refusal) return 'REFUSED';
  if (score >= 85) return 'VERIFIED';
  if (score >= 60) return 'PARTIAL';
  return 'FAILED';
}

export function calculateRequirementWeight(requirements: Requirement[]) {
  const total = requirements.reduce((sum, requirement) => sum + (requirement.required ? requirement.weight : 0), 0);
  return total || 1;
}
