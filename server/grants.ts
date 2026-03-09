import { randomBytes, randomUUID } from 'node:crypto';

import type { GrantRecord, MintGrantRequestBody } from './types';
import { CompatibilityState } from './state';

export function mintOneTimeGrant(
  state: CompatibilityState,
  request: MintGrantRequestBody
): GrantRecord {
  const issuedAt = new Date();
  const ttlSeconds = Math.max(30, Math.min(900, request.ttlSeconds ?? 300));
  const expiresAt = new Date(issuedAt.getTime() + ttlSeconds * 1000);
  const record: GrantRecord = {
    id: randomUUID(),
    token: randomBytes(24).toString('hex'),
    capability: request.capability,
    authority: request.authority,
    clientId: request.clientId,
    flow: request.flow ?? 'manual',
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  state.addGrant(record);
  return record;
}

export function consumeOneTimeGrant(
  state: CompatibilityState,
  token: string,
  capability: string,
  clientId: string
): { ok: true; grant: GrantRecord } | { ok: false; reason: string; grant?: GrantRecord } {
  const record = state.getGrant(token);

  if (!record) {
    return { ok: false, reason: 'grant_not_found' };
  }

  if (record.capability !== capability) {
    return { ok: false, reason: 'grant_capability_mismatch', grant: record };
  }

  if (record.clientId !== clientId) {
    return { ok: false, reason: 'grant_client_mismatch', grant: record };
  }

  if (record.usedAt) {
    return { ok: false, reason: 'grant_already_used', grant: record };
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { ok: false, reason: 'grant_expired', grant: record };
  }

  record.usedAt = new Date().toISOString();
  return { ok: true, grant: record };
}

export function mintResumeGrant(
  state: CompatibilityState,
  flow: 'web_resume' | 'telegram_resume',
  capability: string,
  clientId: string
) {
  return mintOneTimeGrant(state, {
    capability,
    clientId,
    authority: flow,
    flow
  });
}
