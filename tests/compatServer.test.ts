import { once } from 'node:events';

import { afterEach, describe, expect, test } from 'vitest';

import { createCompatibilityServer } from '../server/compatServer';

const servers: Array<{ close: () => void }> = [];

afterEach(() => {
  while (servers.length > 0) {
    servers.pop()?.close();
  }
});

async function startServer() {
  const instance = createCompatibilityServer();
  instance.server.listen(0);
  await once(instance.server, 'listening');
  const address = instance.server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Unable to resolve server address');
  }

  servers.push(instance.server);

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    state: instance.state,
    close: () => instance.server.close()
  };
}

describe('compatibility server', () => {
  test('keeps /v1/invoke available for open capabilities', async () => {
    const { baseUrl } = await startServer();

    const response = await fetch(`${baseUrl}/v1/invoke`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'external-cli',
        'x-authority': 'external'
      },
      body: JSON.stringify({
        capability: 'compat.ping',
        input: { ping: true }
      })
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.mode).toBe('compatibility_surface');
  });

  test('requires one-time grants for approval-bound external invokes and blocks replay', async () => {
    const { baseUrl } = await startServer();

    const minted = await fetch(`${baseUrl}/v1/grants/mint`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'external-cli',
        'x-authority': 'external'
      },
      body: JSON.stringify({
        capability: 'approval.echo',
        clientId: 'external-cli',
        authority: 'external',
        flow: 'manual-test'
      })
    });

    expect(minted.status).toBe(201);
    const mintPayload = await minted.json();
    const token = mintPayload.grant.token as string;

    const firstInvoke = await fetch(`${baseUrl}/v1/invoke`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'external-cli',
        'x-authority': 'external'
      },
      body: JSON.stringify({
        capability: 'approval.echo',
        input: { hello: 'world' },
        grantToken: token
      })
    });

    expect(firstInvoke.status).toBe(200);
    const firstPayload = await firstInvoke.json();
    expect(firstPayload.mode).toBe('one_time_grant');

    const replayInvoke = await fetch(`${baseUrl}/v1/invoke`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'external-cli',
        'x-authority': 'external'
      },
      body: JSON.stringify({
        capability: 'approval.echo',
        input: { hello: 'again' },
        grantToken: token
      })
    });

    expect(replayInvoke.status).toBe(403);
    const replayPayload = await replayInvoke.json();
    expect(replayPayload.reason).toBe('grant_already_used');
  });

  test('repo-local bypass is allowed only for repo_local authority', async () => {
    const { baseUrl } = await startServer();

    const repoLocalInvoke = await fetch(`${baseUrl}/v1/invoke`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'scanner-hot-path',
        'x-authority': 'repo_local',
        'x-repo-local-bypass': '1'
      },
      body: JSON.stringify({
        capability: 'approval.echo'
      })
    });

    expect(repoLocalInvoke.status).toBe(200);
    const repoLocalPayload = await repoLocalInvoke.json();
    expect(repoLocalPayload.mode).toBe('repo_local_bypass');

    const externalBypass = await fetch(`${baseUrl}/v1/invoke`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'external-cli',
        'x-authority': 'external',
        'x-repo-local-bypass': '1'
      },
      body: JSON.stringify({
        capability: 'approval.echo'
      })
    });

    expect(externalBypass.status).toBe(403);
    const deniedPayload = await externalBypass.json();
    expect(deniedPayload.reason).toBe('external_bypass_forbidden');
  });

  test('audit and history expose external compatibility usage', async () => {
    const { baseUrl } = await startServer();

    await fetch(`${baseUrl}/v1/invoke`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'external-cli',
        'x-authority': 'external'
      },
      body: JSON.stringify({
        capability: 'compat.ping'
      })
    });

    const auditResponse = await fetch(`${baseUrl}/v1/audit`);
    const historyResponse = await fetch(`${baseUrl}/v1/history`);
    const auditPayload = await auditResponse.json();
    const historyPayload = await historyResponse.json();

    expect(auditPayload.audits[0].route).toBe('/v1/invoke');
    expect(auditPayload.audits[0].authority).toBe('external');
    expect(historyPayload.history[0].route).toBe('/v1/invoke');
    expect(historyPayload.history[0].outcome).toContain('allowed');
  });

  test('web and telegram resume grant routes reuse the same minting path', async () => {
    const { baseUrl } = await startServer();

    const webGrant = await fetch(`${baseUrl}/v1/resume/web/grants/mint`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'web-client'
      },
      body: JSON.stringify({ capability: 'approval.echo', clientId: 'web-client' })
    });

    const telegramGrant = await fetch(`${baseUrl}/v1/resume/telegram/grants/mint`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': 'telegram-client'
      },
      body: JSON.stringify({ capability: 'approval.echo', clientId: 'telegram-client' })
    });

    expect(webGrant.status).toBe(201);
    expect(telegramGrant.status).toBe(201);

    const webPayload = await webGrant.json();
    const telegramPayload = await telegramGrant.json();

    expect(webPayload.grant.flow).toBe('web_resume');
    expect(telegramPayload.grant.flow).toBe('telegram_resume');
  });
});
