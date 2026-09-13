export type Requirement = {
  id: string;
  description: string;
  required: boolean;
  weight: number;
};

export function normalizeRequirements(requirements: Requirement[] = []): Requirement[] {
  return requirements.map((requirement, index) => ({
    id: requirement.id || `req-${index + 1}`,
    description: requirement.description || 'Requirement is missing a description.',
    required: requirement.required !== false,
    weight: Number.isFinite(requirement.weight) ? requirement.weight : 1,
  }));
}

export function evaluateRequirementCoverage(
  requirements: Requirement[],
  responseText: string,
): { matchRate: number; matched: string[]; missing: string[] } {
  const normalized = normalizeRequirements(requirements);
  const lowerResponse = responseText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  normalized.forEach((requirement) => {
    const haystack = `${requirement.description} ${responseText}`.toLowerCase();
    const hasMatch = haystack.includes(requirement.description.toLowerCase()) || lowerResponse.includes(requirement.description.toLowerCase());

    if (hasMatch) {
      matched.push(requirement.id);
    } else {
      missing.push(requirement.id);
    }
  });

  const matchRate = normalized.length === 0 ? 1 : matched.length / normalized.length;
  return { matchRate, matched, missing };
}
