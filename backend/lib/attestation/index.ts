import { createAttestationHash } from '../hashing';

export type AttestationRecord = {
  id: string;
  agentId: string;
  taskId: string;
  status: 'VERIFIED' | 'PARTIAL' | 'FAILED' | 'REFUSED';
  score: number;
  confidence: number;
  issueHash: string;
  createdAt: string;
};

export function createAttestation(entry: Omit<AttestationRecord, 'issueHash' | 'createdAt'>): AttestationRecord {
  return {
    ...entry,
    issueHash: createAttestationHash({
      agentId: entry.agentId,
      taskId: entry.taskId,
      status: entry.status,
      score: entry.score,
      confidence: entry.confidence,
    }),
    createdAt: new Date().toISOString(),
  };
}
