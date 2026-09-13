import { evaluateCompleteness } from './completeness';
import { assessConsistency } from './consistency';
import { assessEvidence } from './evidence';
import { assessSafety } from './safety';
import { calculateConfidence } from './confidence';
import { calculateRequirementWeight, calculateScore, determineStatus } from './scoring';
import { assessUsability } from './usability';
import { Requirement } from './requirements';

export type VerificationResult = {
  status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'REFUSED';
  score: number;
  confidence: number;
  summary: string;
  checks: {
    completeness: ReturnType<typeof evaluateCompleteness>;
    evidence: ReturnType<typeof assessEvidence>;
    consistency: ReturnType<typeof assessConsistency>;
    safety: ReturnType<typeof assessSafety>;
    usability: ReturnType<typeof assessUsability>;
  };
};

export function verifyAgentDelivery(
  request: string,
  response: string,
  requirements: Requirement[] = [],
  evidence: Array<{ label: string; value: string }> = [],
): VerificationResult {
  const completeness = evaluateCompleteness(requirements, response);
  const evidenceCheck = assessEvidence(evidence, response);
  const consistency = assessConsistency(response);
  const safety = assessSafety(response);
  const usability = assessUsability(response);

  const requirementCoverage = completeness.coverage.matchRate;
  const requirementWeight = calculateRequirementWeight(requirements);
  const safetyScore = safety.refusal ? 0.2 : 1;
  const score = calculateScore({
    requirementCoverage,
    evidenceScore: evidenceCheck.score,
    consistencyScore: consistency.score,
    usabilityScore: usability.usable ? 1 : 0.4,
    safetyScore,
    requirementWeight,
    requiredCount: Math.max(completeness.requiredCount, 1),
  });

  const confidence = calculateConfidence(score, evidenceCheck.score * 100, safety.confidenceAdjustment * 100);
  const status = determineStatus(score, safety.refusal);

  const summary = status === 'REFUSED'
    ? 'The provider refused the task or declined to provide sufficient evidence.'
    : status === 'VERIFIED'
      ? 'The agent appears to meet the request and requirements with clear evidence.'
      : status === 'PARTIAL'
        ? 'The delivery is partially valid but needs improvement on completeness or evidence.'
        : 'The delivery does not satisfy the request with enough quality or evidence.';

  return {
    status,
    score,
    confidence,
    summary,
    checks: {
      completeness,
      evidence: evidenceCheck,
      consistency,
      safety,
      usability,
    },
  };
}
