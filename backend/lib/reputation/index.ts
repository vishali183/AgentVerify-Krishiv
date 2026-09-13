export type ReputationSnapshot = {
  agentId: string;
  reputation: number;
  successRate: number;
  totalVerified: number;
  totalEvaluations: number;
};

export function computeReputation(agentId: string, evaluations: Array<{ score: number; status: string }>): ReputationSnapshot {
  const total = evaluations.length || 1;
  const verified = evaluations.filter((evaluation) => evaluation.status === 'VERIFIED').length;
  const average = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / total;

  return {
    agentId,
    reputation: Math.round(average),
    successRate: Math.round((verified / total) * 100),
    totalVerified: verified,
    totalEvaluations: total,
  };
}
