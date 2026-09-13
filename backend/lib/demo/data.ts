export const demoAgents = [
  { id: 'demo-dataforge', name: 'DataForge', capabilities: ['Data Extraction', 'Evidence Reliability'], reputation: 94, transactions: 42, successRate: 95, status: 'verified' },
  { id: 'demo-synthnet', name: 'SynthNet', capabilities: ['Research', 'Content Generation'], reputation: 91, transactions: 36, successRate: 92, status: 'verified' },
  { id: 'demo-codepilot', name: 'CodePilot', capabilities: ['Content Generation'], reputation: 86, transactions: 18, successRate: 83, status: 'reviewing' },
];

export const demoRecent = [
  { id: 'demo-verification-1042', agent: 'DataForge', status: 'VERIFIED', score: 96, confidence: 94, riskLevel: 'LOW', createdAt: new Date().toISOString() },
  { id: 'demo-verification-1041', agent: 'SynthNet', status: 'PARTIAL', score: 72, confidence: 76, riskLevel: 'MEDIUM', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const demoAttestations = [
  { id: 'demo-attestation-1042', agentId: 'demo-dataforge', provider: 'DataForge', status: 'VERIFIED', score: 96, confidence: 94, hash: 'demo-integrity-hash', createdAt: new Date().toISOString(), verificationId: 'demo-verification-1042' },
];

export const demoAudit = [
  { id: 'demo-audit-1042', actor: 'AgentVerify', action: 'Result attested', resource: 'demo-verification-1042', timestamp: new Date().toISOString(), hash: 'demo-audit-hash' },
];
