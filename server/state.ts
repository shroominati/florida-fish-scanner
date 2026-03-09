import { randomUUID } from 'node:crypto';

import type { AuditRecord, GrantRecord, HistoryRecord } from './types';

export class CompatibilityState {
  readonly grants = new Map<string, GrantRecord>();
  readonly audits: AuditRecord[] = [];
  readonly history: HistoryRecord[] = [];

  addGrant(record: GrantRecord) {
    this.grants.set(record.token, record);
  }

  getGrant(token: string) {
    return this.grants.get(token);
  }

  addAudit(input: Omit<AuditRecord, 'id' | 'createdAt'>) {
    this.audits.unshift({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input
    });
    this.audits.splice(200);
  }

  addHistory(input: Omit<HistoryRecord, 'id' | 'createdAt'>) {
    this.history.unshift({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input
    });
    this.history.splice(200);
  }
}

export function createCompatibilityState() {
  return new CompatibilityState();
}
