export function calculateConfidence(score: number, evidenceCoverage: number, safetyAdjustment: number) {
  const raw = score * 0.6 + evidenceCoverage * 30 + safetyAdjustment * 25;
  const bounded = Math.min(100, Math.max(0, raw));
  return Math.round(bounded);
}
