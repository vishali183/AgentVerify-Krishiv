const daysAgo = (days: number, hours = 0) => new Date(Date.now() - (days * 86400000) - (hours * 3600000)).toISOString();

export const demoAgents = [
  {
    id: 'demo-dataforge',
    name: 'DataForge',
    capabilities: ['Data Extraction', 'Evidence Reliability'],
    reputation: 94,
    transactions: 128,
    successRate: 96,
    status: 'verified',
    lastVerifiedAt: daysAgo(1, 2),
  },
  {
    id: 'demo-synthnet',
    name: 'SynthNet',
    capabilities: ['Research', 'Content Generation', 'Real-Time Information'],
    reputation: 91,
    transactions: 96,
    successRate: 93,
    status: 'verified',
    lastVerifiedAt: daysAgo(2, 5),
  },
  {
    id: 'demo-ledgerlens',
    name: 'LedgerLens',
    capabilities: ['Financial Analysis', 'Evidence Reliability'],
    reputation: 89,
    transactions: 74,
    successRate: 91,
    status: 'verified',
    lastVerifiedAt: daysAgo(3, 1),
  },
  {
    id: 'demo-codepilot',
    name: 'CodePilot',
    capabilities: ['Content Generation', 'Data Extraction'],
    reputation: 86,
    transactions: 58,
    successRate: 84,
    status: 'reviewing',
    lastVerifiedAt: daysAgo(5, 7),
  },
  {
    id: 'demo-signalwatch',
    name: 'SignalWatch',
    capabilities: ['Real-Time Information', 'Research'],
    reputation: 82,
    transactions: 43,
    successRate: 81,
    status: 'reviewing',
    lastVerifiedAt: daysAgo(8, 4),
  },
];

export const demoRecent = [
  { id: 'demo-verification-1048', agent: 'DataForge', status: 'VERIFIED', score: 97, confidence: 96, riskLevel: 'LOW', createdAt: daysAgo(1, 2) },
  { id: 'demo-verification-1047', agent: 'SynthNet', status: 'VERIFIED', score: 93, confidence: 91, riskLevel: 'LOW', createdAt: daysAgo(2, 5) },
  { id: 'demo-verification-1046', agent: 'LedgerLens', status: 'PARTIAL', score: 78, confidence: 84, riskLevel: 'MEDIUM', createdAt: daysAgo(3, 1) },
  { id: 'demo-verification-1045', agent: 'CodePilot', status: 'VERIFIED', score: 88, confidence: 86, riskLevel: 'MEDIUM', createdAt: daysAgo(5, 7) },
  { id: 'demo-verification-1044', agent: 'SignalWatch', status: 'FAILED', score: 48, confidence: 73, riskLevel: 'HIGH', createdAt: daysAgo(8, 4) },
  { id: 'demo-verification-1043', agent: 'DataForge', status: 'VERIFIED', score: 95, confidence: 94, riskLevel: 'LOW', createdAt: daysAgo(10, 3) },
];

export const demoAttestations = [
  { id: 'demo-attestation-1048', agentId: 'demo-dataforge', provider: 'DataForge', status: 'VERIFIED', score: 97, confidence: 96, hash: 'sha256:8b6c1d7e4a2f9c31', createdAt: daysAgo(1, 2), verificationId: 'demo-verification-1048' },
  { id: 'demo-attestation-1047', agentId: 'demo-synthnet', provider: 'SynthNet', status: 'VERIFIED', score: 93, confidence: 91, hash: 'sha256:2fa94e17c6b83d40', createdAt: daysAgo(2, 5), verificationId: 'demo-verification-1047' },
  { id: 'demo-attestation-1045', agentId: 'demo-codepilot', provider: 'CodePilot', status: 'VERIFIED', score: 88, confidence: 86, hash: 'sha256:71d2e8a0f43c9b6e', createdAt: daysAgo(5, 7), verificationId: 'demo-verification-1045' },
];

export const demoAudit = [
  { id: 'demo-audit-1048-1', actor: 'AgentVerify', action: 'Verification completed', resource: 'demo-verification-1048', timestamp: daysAgo(1, 2), hash: 'sha256:4c8a2e1f90d7b653', verification: { id: 'demo-verification-1048', status: 'VERIFIED', score: 97 } },
  { id: 'demo-audit-1048-2', actor: 'AgentVerify', action: 'Attestation issued', resource: 'demo-attestation-1048', timestamp: daysAgo(1, 2, ), hash: 'sha256:8b6c1d7e4a2f9c31', verification: { id: 'demo-verification-1048', status: 'VERIFIED', score: 97 } },
  { id: 'demo-audit-1047-1', actor: 'operator@agentverify.local', action: 'Verification completed', resource: 'demo-verification-1047', timestamp: daysAgo(2, 5), hash: 'sha256:53d91a7c2e840fb6', verification: { id: 'demo-verification-1047', status: 'VERIFIED', score: 93 } },
  { id: 'demo-audit-1046-1', actor: 'AgentVerify', action: 'Partial result recorded', resource: 'demo-verification-1046', timestamp: daysAgo(3, 1), hash: 'sha256:ab092c7e41d5f863', verification: { id: 'demo-verification-1046', status: 'PARTIAL', score: 78 } },
  { id: 'demo-audit-1045-1', actor: 'AgentVerify', action: 'Verification completed', resource: 'demo-verification-1045', timestamp: daysAgo(5, 7), hash: 'sha256:1fe78a0d4c629b35', verification: { id: 'demo-verification-1045', status: 'VERIFIED', score: 88 } },
  { id: 'demo-audit-1044-1', actor: 'risk-engine', action: 'High-risk result flagged', resource: 'demo-verification-1044', timestamp: daysAgo(8, 4), hash: 'sha256:90bc3e71a4f2d658', verification: { id: 'demo-verification-1044', status: 'FAILED', score: 48 } },
];
