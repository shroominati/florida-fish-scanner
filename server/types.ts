export type AuthorityKind = 'external' | 'repo_local' | 'web_resume' | 'telegram_resume';

export interface CapabilityDefinition {
  id: string;
  requiresApproval: boolean;
  description: string;
}

export interface GrantRecord {
  id: string;
  token: string;
  capability: string;
  authority: AuthorityKind;
  clientId: string;
  flow: string;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface AuditRecord {
  id: string;
  route: string;
  authority: AuthorityKind;
  clientId: string;
  capability?: string;
  grantId?: string;
  result: 'allowed' | 'denied';
  reason: string;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  route: string;
  authority: AuthorityKind;
  clientId: string;
  capability?: string;
  outcome: string;
  createdAt: string;
}

export interface InvokeRequestBody {
  capability: string;
  input?: unknown;
  grantToken?: string;
}

export interface MintGrantRequestBody {
  capability: string;
  clientId: string;
  authority: AuthorityKind;
  flow?: string;
  ttlSeconds?: number;
}
