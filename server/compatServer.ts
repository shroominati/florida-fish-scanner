import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { URL } from 'node:url';

import { capabilityRegistry, getCapability } from './capabilities';
import { consumeOneTimeGrant, mintOneTimeGrant, mintResumeGrant } from './grants';
import { createCompatibilityState, CompatibilityState } from './state';
import type {
  AuthorityKind,
  InvokeRequestBody,
  MintGrantRequestBody
} from './types';

function json(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode;
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(payload, null, 2));
}

function html(response: ServerResponse, statusCode: number, body: string) {
  response.statusCode = statusCode;
  response.setHeader('content-type', 'text/html; charset=utf-8');
  response.end(body);
}

async function readJsonBody<T>(request: IncomingMessage): Promise<T | undefined> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T;
}

function authorityFromRequest(request: IncomingMessage): AuthorityKind {
  const raw = request.headers['x-authority'];
  if (raw === 'repo_local' || raw === 'web_resume' || raw === 'telegram_resume') {
    return raw;
  }
  return 'external';
}

function clientIdFromRequest(request: IncomingMessage): string {
  const raw = request.headers['x-client-id'];
  return typeof raw === 'string' && raw.trim() ? raw.trim() : 'anonymous-client';
}

function recordDecision(
  state: CompatibilityState,
  route: string,
  authority: AuthorityKind,
  clientId: string,
  capability: string | undefined,
  result: 'allowed' | 'denied',
  reason: string,
  grantId?: string
) {
  state.addAudit({
    route,
    authority,
    clientId,
    capability,
    grantId,
    result,
    reason
  });
  state.addHistory({
    route,
    authority,
    clientId,
    capability,
    outcome: `${result}:${reason}`
  });
}

export function createCompatibilityServer(state = createCompatibilityState()) {
  const server = createServer(async (request, response) => {
    const method = request.method ?? 'GET';
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const authority = authorityFromRequest(request);
    const clientId = clientIdFromRequest(request);

    if (method === 'GET' && url.pathname === '/') {
      const payload = {
        ok: true,
        service: 'florida-fish-scanner-compat',
        message: 'Compatibility server is running.',
        routes: [
          '/health',
          '/v1/capabilities',
          '/v1/grants/mint',
          '/v1/resume/web/grants/mint',
          '/v1/resume/telegram/grants/mint',
          '/v1/invoke',
          '/v1/audit',
          '/v1/history'
        ]
      };
      const accept = request.headers.accept ?? '';

      if (typeof accept === 'string' && accept.includes('text/html')) {
        return html(
          response,
          200,
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Florida Fish Scanner Compat</title>
    <style>
      body {
        margin: 0;
        padding: 24px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #08131a;
        color: #f2f7f9;
      }
      main {
        max-width: 760px;
        margin: 0 auto;
      }
      h1 {
        margin-bottom: 8px;
      }
      p {
        color: #c8d6dd;
      }
      code {
        background: #10232d;
        padding: 2px 6px;
        border-radius: 6px;
      }
      ul {
        padding-left: 20px;
      }
      a {
        color: #7dd3fc;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Florida Fish Scanner Compat</h1>
      <p>Compatibility server is running.</p>
      <p>Available routes:</p>
      <ul>
        <li><a href="/health"><code>/health</code></a></li>
        <li><a href="/v1/capabilities"><code>/v1/capabilities</code></a></li>
        <li><a href="/v1/audit"><code>/v1/audit</code></a></li>
        <li><a href="/v1/history"><code>/v1/history</code></a></li>
      </ul>
      <p>POST endpoints:</p>
      <ul>
        <li><code>/v1/grants/mint</code></li>
        <li><code>/v1/resume/web/grants/mint</code></li>
        <li><code>/v1/resume/telegram/grants/mint</code></li>
        <li><code>/v1/invoke</code></li>
      </ul>
    </main>
  </body>
</html>`
        );
      }

      return json(response, 200, payload);
    }

    if (method === 'GET' && url.pathname === '/health') {
      return json(response, 200, { ok: true });
    }

    if (method === 'GET' && url.pathname === '/v1/capabilities') {
      return json(response, 200, { capabilities: capabilityRegistry });
    }

    if (method === 'GET' && url.pathname === '/v1/audit') {
      return json(response, 200, { audits: state.audits });
    }

    if (method === 'GET' && url.pathname === '/v1/history') {
      return json(response, 200, { history: state.history });
    }

    if (method === 'POST' && url.pathname === '/v1/grants/mint') {
      const body = (await readJsonBody<MintGrantRequestBody>(request)) ?? {
        capability: '',
        clientId,
        authority
      };
      const capability = getCapability(body.capability);

      if (!capability) {
        recordDecision(state, url.pathname, authority, clientId, body.capability, 'denied', 'unknown_capability');
        return json(response, 404, { error: 'unknown_capability' });
      }

      const grant = mintOneTimeGrant(state, {
        capability: body.capability,
        clientId: body.clientId || clientId,
        authority: body.authority ?? authority,
        flow: body.flow ?? 'manual',
        ttlSeconds: body.ttlSeconds
      });

      recordDecision(state, url.pathname, body.authority ?? authority, body.clientId || clientId, body.capability, 'allowed', 'grant_minted', grant.id);
      return json(response, 201, {
        grant: {
          id: grant.id,
          token: grant.token,
          capability: grant.capability,
          authority: grant.authority,
          clientId: grant.clientId,
          flow: grant.flow,
          issuedAt: grant.issuedAt,
          expiresAt: grant.expiresAt,
          usesRemaining: grant.usedAt ? 0 : 1
        }
      });
    }

    if (method === 'POST' && url.pathname === '/v1/resume/web/grants/mint') {
      const body = (await readJsonBody<{ capability: string; clientId?: string }>(request)) ?? { capability: '' };
      const grant = mintResumeGrant(state, 'web_resume', body.capability, body.clientId || clientId);
      recordDecision(state, url.pathname, 'web_resume', body.clientId || clientId, body.capability, 'allowed', 'grant_minted', grant.id);
      return json(response, 201, { grant });
    }

    if (method === 'POST' && url.pathname === '/v1/resume/telegram/grants/mint') {
      const body = (await readJsonBody<{ capability: string; clientId?: string }>(request)) ?? { capability: '' };
      const grant = mintResumeGrant(state, 'telegram_resume', body.capability, body.clientId || clientId);
      recordDecision(state, url.pathname, 'telegram_resume', body.clientId || clientId, body.capability, 'allowed', 'grant_minted', grant.id);
      return json(response, 201, { grant });
    }

    if (method === 'POST' && url.pathname === '/v1/invoke') {
      const body = (await readJsonBody<InvokeRequestBody>(request)) ?? { capability: '' };
      const capability = getCapability(body.capability);

      if (!capability) {
        recordDecision(state, url.pathname, authority, clientId, body.capability, 'denied', 'unknown_capability');
        return json(response, 404, { error: 'unknown_capability' });
      }

      const bypassHeader = request.headers['x-repo-local-bypass'];
      const repoLocalBypassRequested = bypassHeader === '1' || bypassHeader === 'true';

      if (!capability.requiresApproval) {
        recordDecision(state, url.pathname, authority, clientId, body.capability, 'allowed', 'capability_open');
        return json(response, 200, {
          ok: true,
          route: '/v1/invoke',
          capability: body.capability,
          authority,
          decision: 'allowed',
          mode: 'compatibility_surface',
          input: body.input ?? null
        });
      }

      if (repoLocalBypassRequested && authority === 'repo_local') {
        recordDecision(state, url.pathname, authority, clientId, body.capability, 'allowed', 'repo_local_bypass');
        return json(response, 200, {
          ok: true,
          route: '/v1/invoke',
          capability: body.capability,
          authority,
          decision: 'allowed',
          mode: 'repo_local_bypass',
          input: body.input ?? null
        });
      }

      if (repoLocalBypassRequested && authority !== 'repo_local') {
        recordDecision(state, url.pathname, authority, clientId, body.capability, 'denied', 'external_bypass_forbidden');
        return json(response, 403, {
          ok: false,
          error: 'approval_required',
          reason: 'external_bypass_forbidden'
        });
      }

      if (!body.grantToken) {
        recordDecision(state, url.pathname, authority, clientId, body.capability, 'denied', 'missing_grant');
        return json(response, 403, {
          ok: false,
          error: 'approval_required',
          reason: 'missing_grant'
        });
      }

      const grantResult = consumeOneTimeGrant(state, body.grantToken, body.capability, clientId);

      if (!grantResult.ok) {
        recordDecision(
          state,
          url.pathname,
          authority,
          clientId,
          body.capability,
          'denied',
          grantResult.reason,
          grantResult.grant?.id
        );
        return json(response, 403, {
          ok: false,
          error: 'approval_required',
          reason: grantResult.reason
        });
      }

      recordDecision(
        state,
        url.pathname,
        authority,
        clientId,
        body.capability,
        'allowed',
        'one_time_grant_consumed',
        grantResult.grant.id
      );
      return json(response, 200, {
        ok: true,
        route: '/v1/invoke',
        capability: body.capability,
        authority,
        decision: 'allowed',
        mode: 'one_time_grant',
        input: body.input ?? null,
        grantId: grantResult.grant.id
      });
    }

    json(response, 404, { error: 'not_found', route: url.pathname });
  });

  return {
    state,
    server
  };
}
