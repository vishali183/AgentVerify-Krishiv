export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  hash: string;
};

export function createAuditEntry(entry: Omit<AuditEntry, 'hash' | 'timestamp'>): AuditEntry {
  return {
    ...entry,
    timestamp: new Date().toISOString(),
    hash: `${entry.actor}:${entry.action}:${entry.resource}`,
  };
}
