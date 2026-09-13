export type SharedNetServiceManifest = {
  name: string;
  description: string;
  endpoints: string[];
  trustModel: string;
};

export function createSharedNetManifest(name: string): SharedNetServiceManifest {
  return {
    name,
    description: 'Agent-to-agent delivery verification and attestation service.',
    endpoints: ['/api/verify', '/api/attestations', '/api/reputation'],
    trustModel: 'requirement-based verification with cryptographic attestation',
  };
}
