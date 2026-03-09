import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
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

const staticRoot = resolve(process.cwd(), 'dist');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function canServeStatic(pathname: string): boolean {
  return pathname === '/' || (!pathname.startsWith('/v1/') && pathname !== '/health' && pathname !== '/__compat');
}

async function tryServeStaticApp(pathname: string, response: ServerResponse): Promise<boolean> {
  if (!(await fileExists(staticRoot))) {
    return false;
  }

  const normalizedPath = pathname === '/' ? '/index.html' : pathname;
  const requestedPath = resolve(join(staticRoot, normalize(normalizedPath)));

  if (!requestedPath.startsWith(staticRoot)) {
    response.statusCode = 403;
    response.end('Forbidden');
    return true;
  }

  let filePath = requestedPath;
  const hasExtension = extname(filePath).length > 0;

  if (!(await fileExists(filePath))) {
    if (hasExtension) {
      return false;
    }

    filePath = join(staticRoot, 'index.html');

    if (!(await fileExists(filePath))) {
      return false;
    }
  }

  const body = await readFile(filePath);
  const extension = extname(filePath).toLowerCase();
  response.statusCode = 200;
  response.setHeader('content-type', contentTypes[extension] ?? 'application/octet-stream');
  response.end(body);
  return true;
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

    if ((method === 'GET' || method === 'HEAD') && canServeStatic(url.pathname)) {
      const served = await tryServeStaticApp(url.pathname, response);

      if (served) {
        return;
      }
    }

    if (method === 'GET' && (url.pathname === '/__compat' || url.pathname === '/')) {
      const payload = {
        ok: true,
        service: 'florida-fish-scanner-compat',
        message: 'Compatibility server is running.',
        routes: [
          '/',
          '/__compat',
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
      :root {
        color-scheme: dark;
        --bg: #07141b;
        --panel: #0e222c;
        --panel-border: #173845;
        --text: #edf7fb;
        --muted: #a5c0cb;
        --accent: #4fd1c5;
        --accent-2: #7dd3fc;
        --danger: #ff8a8a;
        --warning: #ffd36e;
      }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: radial-gradient(circle at top, #0c2a36 0%, var(--bg) 58%);
        color: var(--text);
      }
      main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 42px;
        line-height: 1.05;
      }
      p {
        color: var(--muted);
        line-height: 1.5;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 18px;
      }
      .hero {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
        margin-bottom: 24px;
      }
      .hero-copy {
        max-width: 720px;
      }
      .status {
        min-width: 220px;
        background: rgba(79, 209, 197, 0.12);
        border: 1px solid rgba(79, 209, 197, 0.3);
        border-radius: 16px;
        padding: 16px;
      }
      .status strong {
        display: block;
        margin-bottom: 6px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
      }
      .card {
        background: rgba(14, 34, 44, 0.94);
        border: 1px solid var(--panel-border);
        border-radius: 18px;
        padding: 18px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
      }
      .card.wide {
        grid-column: 1 / -1;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .form-grid.full {
        grid-template-columns: 1fr;
      }
      label {
        display: block;
        font-size: 13px;
        margin-bottom: 6px;
        color: var(--muted);
      }
      input,
      select,
      textarea,
      button {
        width: 100%;
        box-sizing: border-box;
        border-radius: 12px;
        border: 1px solid #295162;
        background: #0a1a22;
        color: var(--text);
        padding: 11px 12px;
        font: inherit;
      }
      textarea {
        min-height: 108px;
        resize: vertical;
      }
      button {
        width: auto;
        border: 0;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: #03222b;
        font-weight: 700;
        cursor: pointer;
      }
      button.secondary {
        background: #163847;
        color: var(--text);
        border: 1px solid #295162;
      }
      .button-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .pill-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin: 12px 0 0;
      }
      .pill {
        border-radius: 999px;
        background: #12303c;
        border: 1px solid #214b5c;
        color: var(--text);
        padding: 6px 10px;
        font-size: 12px;
      }
      .pill.warn {
        color: #1f1700;
        background: var(--warning);
        border-color: transparent;
      }
      .pill.bad {
        color: #2d0202;
        background: var(--danger);
        border-color: transparent;
      }
      code {
        background: #10232d;
        padding: 2px 6px;
        border-radius: 6px;
      }
      pre {
        margin: 0;
        padding: 14px;
        background: #08151c;
        border: 1px solid #163644;
        border-radius: 14px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .list {
        display: grid;
        gap: 10px;
      }
      .list-item {
        background: #0a1a22;
        border: 1px solid #153542;
        border-radius: 12px;
        padding: 12px;
      }
      .list-item strong {
        display: block;
        margin-bottom: 4px;
      }
      .muted {
        color: var(--muted);
      }
      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
      .footer {
        margin-top: 16px;
        font-size: 13px;
        color: var(--muted);
      }
      @media (max-width: 820px) {
        .hero {
          flex-direction: column;
        }
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div class="hero-copy">
          <h1>Florida Fish Scanner Compat</h1>
          <p>This is an interactive compatibility test console for the embedded server. You can inspect capabilities, mint one-time grants, invoke approval-bound endpoints, and review audit/history without dropping to the terminal.</p>
          <div class="pill-row">
            <span class="pill">/v1/invoke stays enabled</span>
            <span class="pill">one-time grants</span>
            <span class="pill">audit + history</span>
            <span class="pill warn">repo-local bypass only</span>
          </div>
        </div>
        <aside class="status">
          <strong id="health-status">Checking health...</strong>
          <span class="muted mono" id="base-url"></span>
        </aside>
      </section>

      <section class="grid">
        <article class="card">
          <h2>Capabilities</h2>
          <p>Approval-bound capabilities require a one-time grant unless the caller is an explicit repo-local bypass caller.</p>
          <div id="capabilities-list" class="list"></div>
          <div class="button-row">
            <button class="secondary" type="button" id="refresh-capabilities">Refresh capabilities</button>
          </div>
        </article>

        <article class="card">
          <h2>Mint One-Time Grant</h2>
          <div class="form-grid">
            <div>
              <label for="grant-capability">Capability</label>
              <select id="grant-capability">
                <option value="approval.echo">approval.echo</option>
              </select>
            </div>
            <div>
              <label for="grant-authority">Authority</label>
              <select id="grant-authority">
                <option value="external">external</option>
                <option value="web_resume">web_resume</option>
                <option value="telegram_resume">telegram_resume</option>
                <option value="repo_local">repo_local</option>
              </select>
            </div>
            <div>
              <label for="grant-client-id">Client ID</label>
              <input id="grant-client-id" value="browser-client" />
            </div>
            <div>
              <label for="grant-flow">Flow label</label>
              <input id="grant-flow" value="browser-console" />
            </div>
          </div>
          <div class="button-row">
            <button type="button" id="mint-grant">Mint grant</button>
            <button class="secondary" type="button" id="mint-web-grant">Mint web resume grant</button>
            <button class="secondary" type="button" id="mint-telegram-grant">Mint Telegram resume grant</button>
          </div>
          <p class="footer">Latest token auto-populates the invoke form.</p>
        </article>

        <article class="card">
          <h2>Invoke Capability</h2>
          <div class="form-grid">
            <div>
              <label for="invoke-capability">Capability</label>
              <select id="invoke-capability">
                <option value="compat.ping">compat.ping</option>
                <option value="approval.echo">approval.echo</option>
              </select>
            </div>
            <div>
              <label for="invoke-authority">Authority</label>
              <select id="invoke-authority">
                <option value="external">external</option>
                <option value="repo_local">repo_local</option>
                <option value="web_resume">web_resume</option>
                <option value="telegram_resume">telegram_resume</option>
              </select>
            </div>
            <div>
              <label for="invoke-client-id">Client ID</label>
              <input id="invoke-client-id" value="browser-client" />
            </div>
            <div>
              <label for="invoke-grant-token">Grant token</label>
              <input id="invoke-grant-token" placeholder="Required for approval.echo unless repo-local bypass" />
            </div>
          </div>
          <div class="form-grid full">
            <div>
              <label for="invoke-input">Input JSON</label>
              <textarea id="invoke-input">{
  "hello": "world"
}</textarea>
            </div>
          </div>
          <div class="button-row">
            <button type="button" id="invoke-button">Invoke</button>
            <button class="secondary" type="button" id="invoke-bypass">Invoke with repo-local bypass</button>
          </div>
        </article>

        <article class="card wide">
          <h2>Response</h2>
          <pre id="response-output">Waiting for action...</pre>
        </article>

        <article class="card">
          <h2>Audit</h2>
          <p>Every allow/deny decision recorded by the compatibility surface.</p>
          <div class="button-row">
            <button class="secondary" type="button" id="refresh-audit">Refresh audit</button>
          </div>
          <pre id="audit-output">Loading audit...</pre>
        </article>

        <article class="card">
          <h2>History</h2>
          <p>Readout surface for route outcomes and actor visibility.</p>
          <div class="button-row">
            <button class="secondary" type="button" id="refresh-history">Refresh history</button>
          </div>
          <pre id="history-output">Loading history...</pre>
        </article>
      </section>
    </main>
    <script>
      const responseOutput = document.getElementById('response-output');
      const auditOutput = document.getElementById('audit-output');
      const historyOutput = document.getElementById('history-output');
      const capabilitiesList = document.getElementById('capabilities-list');
      const healthStatus = document.getElementById('health-status');
      const baseUrl = document.getElementById('base-url');
      const grantTokenInput = document.getElementById('invoke-grant-token');

      baseUrl.textContent = window.location.origin;

      function pretty(value) {
        return JSON.stringify(value, null, 2);
      }

      function setResponse(label, value) {
        responseOutput.textContent = label + "\\n\\n" + (typeof value === 'string' ? value : pretty(value));
      }

      async function requestJson(path, options) {
        const response = await fetch(path, options);
        const contentType = response.headers.get('content-type') || '';
        const body = contentType.includes('application/json')
          ? await response.json()
          : await response.text();
        return { ok: response.ok, status: response.status, body };
      }

      function renderCapabilities(capabilities) {
        capabilitiesList.innerHTML = '';
        capabilities.forEach((capability) => {
          const item = document.createElement('div');
          item.className = 'list-item';
          item.innerHTML =
            '<strong class="mono">' + capability.id + '</strong>' +
            '<div class="muted">' + capability.description + '</div>' +
            '<div class="pill-row">' +
              '<span class="pill ' + (capability.requiresApproval ? 'warn' : '') + '">' +
                (capability.requiresApproval ? 'approval required' : 'open capability') +
              '</span>' +
            '</div>';
          capabilitiesList.appendChild(item);
        });
      }

      async function loadCapabilities() {
        const result = await requestJson('/v1/capabilities');
        if (!result.ok) {
          renderCapabilities([]);
          setResponse('Failed to load capabilities', result.body);
          return;
        }
        renderCapabilities(result.body.capabilities || []);
      }

      async function loadHealth() {
        const result = await requestJson('/health');
        healthStatus.textContent = result.ok ? 'Healthy' : 'Health check failed';
      }

      async function loadAudit() {
        const result = await requestJson('/v1/audit');
        auditOutput.textContent = pretty(result.body);
      }

      async function loadHistory() {
        const result = await requestJson('/v1/history');
        historyOutput.textContent = pretty(result.body);
      }

      function parseInputJson() {
        const raw = document.getElementById('invoke-input').value.trim();
        if (!raw) {
          return null;
        }
        return JSON.parse(raw);
      }

      async function mintGrant(kind) {
        const capability = document.getElementById('grant-capability').value;
        const authority = document.getElementById('grant-authority').value;
        const clientId = document.getElementById('grant-client-id').value.trim() || 'browser-client';
        const flow = document.getElementById('grant-flow').value.trim() || 'browser-console';

        let path = '/v1/grants/mint';
        let payload = { capability, authority, clientId, flow };
        if (kind === 'web') {
          path = '/v1/resume/web/grants/mint';
          payload = { capability, clientId };
        }
        if (kind === 'telegram') {
          path = '/v1/resume/telegram/grants/mint';
          payload = { capability, clientId };
        }

        const result = await requestJson(path, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-client-id': clientId,
            'x-authority': authority
          },
          body: JSON.stringify(payload)
        });

        if (result.ok && result.body.grant && result.body.grant.token) {
          grantTokenInput.value = result.body.grant.token;
        }

        setResponse('Grant mint response', { status: result.status, body: result.body });
        loadAudit();
        loadHistory();
      }

      async function invokeCapability(useBypass) {
        try {
          const capability = document.getElementById('invoke-capability').value;
          const authority = document.getElementById('invoke-authority').value;
          const clientId = document.getElementById('invoke-client-id').value.trim() || 'browser-client';
          const grantToken = grantTokenInput.value.trim();
          const input = parseInputJson();

          const headers = {
            'content-type': 'application/json',
            'x-client-id': clientId,
            'x-authority': authority
          };

          if (useBypass) {
            headers['x-repo-local-bypass'] = '1';
          }

          const body = { capability, input, grantToken: grantToken || undefined };
          const result = await requestJson('/v1/invoke', {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          });

          setResponse('Invoke response', { status: result.status, body: result.body });
          loadAudit();
          loadHistory();
        } catch (error) {
          setResponse('Invoke error', { error: error.message || String(error) });
        }
      }

      document.getElementById('refresh-capabilities').addEventListener('click', loadCapabilities);
      document.getElementById('mint-grant').addEventListener('click', () => mintGrant('default'));
      document.getElementById('mint-web-grant').addEventListener('click', () => mintGrant('web'));
      document.getElementById('mint-telegram-grant').addEventListener('click', () => mintGrant('telegram'));
      document.getElementById('invoke-button').addEventListener('click', () => invokeCapability(false));
      document.getElementById('invoke-bypass').addEventListener('click', () => invokeCapability(true));
      document.getElementById('refresh-audit').addEventListener('click', loadAudit);
      document.getElementById('refresh-history').addEventListener('click', loadHistory);

      loadHealth();
      loadCapabilities();
      loadAudit();
      loadHistory();
    </script>
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
