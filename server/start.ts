import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { createCompatibilityServer } from './compatServer';

const distIndexPath = resolve(process.cwd(), 'dist', 'index.html');

function ensureWebBuild() {
  if (existsSync(distIndexPath)) {
    return;
  }

  console.log('No web build found at dist/index.html. Exporting the Expo web app before starting the server.');
  execFileSync('npx', ['expo', 'export', '--platform', 'web'], {
    stdio: 'inherit',
    env: process.env
  });
}

ensureWebBuild();

const port = Number(process.env.PORT || process.env.COMPAT_SERVER_PORT || 4318);
const host = '0.0.0.0';
const { server } = createCompatibilityServer();

server.listen(port, host, () => {
  console.log(`Compatibility server listening on http://${host}:${port}`);
  console.log('Routes: /, /__compat, /health, /v1/capabilities, /v1/grants/mint, /v1/resume/web/grants/mint, /v1/resume/telegram/grants/mint, /v1/invoke, /v1/audit, /v1/history');
});
