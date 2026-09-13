import { evaluateRequirementCoverage, Requirement } from './requirements';

export function evaluateCompleteness(requirements: Requirement[], responseText: string) {
  const coverage = evaluateRequirementCoverage(requirements, responseText);
  const requiredCount = requirements.filter((r) => r.required).length;
  const missingRequired = requirements.filter((r) => r.required && coverage.missing.includes(r.id));

  return {
    coverage,
    requiredCount,
    missingRequired: missingRequired.length,
    complete: missingRequired.length === 0 && coverage.matchRate >= 0.8,
  };
}
