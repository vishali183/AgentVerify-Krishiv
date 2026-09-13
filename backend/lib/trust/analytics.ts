import { createAttestationHash } from '../hashing';
import { getPrisma } from '../persistence/prisma';
import { KNOWN_CAPABILITIES, Capability } from './capabilities';

type VerificationRecord = {
  score: number;
  confidence: number;
  status: string;
  createdAt: Date;
  capabilities: string[];
  riskLevel: string;
};

function weightedAverage(records: VerificationRecord[], value: (record: VerificationRecord) => number): number {
  if (!records.length) return 0;
  const now = Date.now();
  let total = 0;
  let weights = 0;
  records.forEach((record) => {
    const ageDays = Math.max(0, (now - record.createdAt.getTime()) / 86400000);
    const weight = Math.exp(-ageDays / 90);
    total += value(record) * weight;
    weights += weight;
  });
  return Math.round(total / weights);
}

export function getTrend(records: VerificationRecord[]): 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA' {
  if (records.length < 3) return 'INSUFFICIENT_DATA';
  const recent = records.slice(0, Math.ceil(records.length / 2));
  const older = records.slice(Math.ceil(records.length / 2));
  const delta = weightedAverage(recent, (record) => record.score) - weightedAverage(older, (record) => record.score);
  if (delta >= 5) return 'IMPROVING';
  if (delta <= -5) return 'DECLINING';
  return 'STABLE';
}

export async function getAgentTrust(externalId: string) {
  const agent = await getPrisma().agent.findUnique({
    where: { externalId },
    include: { verifications: { orderBy: { createdAt: 'desc' }, take: 100 }, capabilities: true },
  });
  if (!agent) return null;
  const records = agent.verifications as VerificationRecord[];
  const capabilityTrust = KNOWN_CAPABILITIES.map((capability) => {
    const matches = records.filter((record) => record.capabilities.includes(capability));
    if (matches.length < 2) return { capability, sufficientData: false, score: null, transactions: matches.length, successRate: null, confidence: null, trend: 'INSUFFICIENT_DATA' };
    return {
      capability,
      sufficientData: true,
      score: weightedAverage(matches, (record) => record.score),
      transactions: matches.length,
      successRate: Math.round(matches.filter((record) => record.status === 'VERIFIED').length / matches.length * 100),
      confidence: weightedAverage(matches, (record) => record.confidence),
      trend: getTrend(matches),
    };
  });
  return {
    agent: { id: agent.externalId, name: agent.name },
    overall: {
      score: records.length ? weightedAverage(records, (record) => record.score) : null,
      transactions: records.length,
      successRate: records.length ? Math.round(records.filter((record) => record.status === 'VERIFIED').length / records.length * 100) : null,
      trend: getTrend(records),
    },
    capabilities: capabilityTrust,
    history: records,
  };
}

export async function createPassport(externalId: string) {
  const trust = await getAgentTrust(externalId);
  if (!trust) return null;
  const passportData = {
    agent: trust.agent,
    overall: trust.overall,
    capabilities: trust.capabilities,
    issuedAt: new Date().toISOString(),
  };
  return { ...passportData, integrityHash: createAttestationHash(passportData) };
}

export function verifyPassportIntegrity(passport: Record<string, unknown>) {
  const { integrityHash, ...data } = passport;
  return typeof integrityHash === 'string' && createAttestationHash(data) === integrityHash;
}

export async function matchAgents(input: { task: string; capability?: string; budget?: number; riskTolerance?: string }) {
  const agents = await getPrisma().agent.findMany({ include: { verifications: { orderBy: { createdAt: 'desc' }, take: 30 } } });
  const capability = input.capability || KNOWN_CAPABILITIES.find((item) => input.task.toLowerCase().includes(item.toLowerCase())) || 'Content Generation';
  return agents.map((agent) => {
    const records = (agent.verifications as VerificationRecord[]).filter((record) => record.capabilities.includes(capability));
    const trust = records.length ? weightedAverage(records, (record) => record.score) : 0;
    const evidence = records.length ? weightedAverage(records, (record) => record.confidence) : 0;
    const riskPenalty = input.riskTolerance === 'LOW' && records.some((record) => record.riskLevel === 'HIGH') ? 25 : 0;
    const score = Math.max(0, Math.round(trust * 0.55 + evidence * 0.3 + Math.min(records.length, 10) * 1.5 - riskPenalty));
    return { agentId: agent.externalId, agentName: agent.name, matchScore: score, capabilityTrust: trust || null, evidenceReliability: evidence || null, riskLevel: riskPenalty ? 'HIGH' : trust >= 85 ? 'LOW' : 'MEDIUM', reason: records.length ? `${agent.name} has ${trust}% recent ${capability} trust across ${records.length} transactions.` : `${agent.name} has insufficient ${capability} history.` };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
