export function assessConsistency(responseText: string): { contradictions: string[]; score: number } {
  const lower = responseText.toLowerCase();
  const contradictions: string[] = [];

  if (lower.includes('done') && lower.includes('not completed')) {
    contradictions.push('Response contains mutually exclusive completion and incompletion statements.');
  }

  if (lower.includes('100%') && lower.includes('not fully')) {
    contradictions.push('Response claims full completion and partial completion simultaneously.');
  }

  return {
    contradictions,
    score: contradictions.length === 0 ? 1 : 0.5,
  };
}
