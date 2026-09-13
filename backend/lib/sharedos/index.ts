export type SharedOsManifest = {
  service: string;
  version: string;
  mode: 'demo' | 'production';
  capabilities: string[];
};

export function createSharedOsManifest(service: string): SharedOsManifest {
  return {
    service,
    version: '1.0.0',
    mode: 'demo',
    capabilities: ['verification', 'attestation', 'reputation', 'audit'],
  };
}
