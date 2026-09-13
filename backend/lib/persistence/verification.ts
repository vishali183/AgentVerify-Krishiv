import { createAttestation } from '../attestation';
import { createAuditEntry } from '../audit';
import { VerificationResult } from '../verification/engine';
import { Requirement } from '../verification/requirements';
import { getPrisma } from './prisma';
import { detectCapabilities, getRecommendation, getRiskLevel } from '../trust/capabilities';

type EvidenceItem = { label: string; value: string };

export async function persistVerification(input: {
  requestText: string;
  responseText: string;
  requirements: Requirement[];
  evidence: EvidenceItem[];
  result: VerificationResult;
  providerExternalId?: string;
  buyerAgent?: string;
}) {
  const attestation = createAttestation({
    id: `att-${Date.now()}`,
    agentId: input.providerExternalId || 'demo-provider',
    taskId: `verification-${Date.now()}`,
    status: input.result.status,
    score: input.result.score,
    confidence: input.result.confidence,
  });
  const audit = createAuditEntry({
    id: `audit-${Date.now()}`,
    actor: 'AgentVerify',
    action: 'Verification attested',
    resource: attestation.taskId,
  });
  const capabilities = detectCapabilities(`${input.requestText} ${input.responseText}`);
  const riskLevel = getRiskLevel(input.result);

  return getPrisma().verification.create({
    data: {
      requestText: input.requestText,
      responseText: input.responseText,
      status: input.result.status,
      score: input.result.score,
      confidence: input.result.confidence,
      summary: input.result.summary,
      checks: input.result.checks,
      buyerAgent: input.buyerAgent,
      riskLevel,
      capabilities,
      recommendation: getRecommendation(input.result),
      provider: input.providerExternalId
        ? {
            connectOrCreate: {
              where: { externalId: input.providerExternalId },
              create: {
                externalId: input.providerExternalId,
                name: input.providerExternalId,
              },
            },
          }
        : undefined,
      requirements: {
        create: input.requirements.map((requirement) => ({
          externalId: requirement.id,
          description: requirement.description,
          required: requirement.required,
          weight: requirement.weight,
        })),
      },
      evidence: {
        create: input.evidence.map((item) => ({
          label: item.label,
          value: item.value,
        })),
      },
      attestation: {
        create: {
          status: attestation.status,
          score: attestation.score,
          confidence: attestation.confidence,
          agentId: attestation.agentId,
          taskId: attestation.taskId,
          issueHash: attestation.issueHash,
        },
      },
      auditEvents: {
        create: {
          actor: audit.actor,
          action: audit.action,
          resource: audit.resource,
          hash: audit.hash,
        },
      },
    },
    include: {
      attestation: true,
      auditEvents: true,
    },
  });
}
