#!/usr/bin/env node
/**
 * Smoke test — run before every deploy: `npm run smoke`
 * (assumes `next build` already ran; starts the production server
 * on a scratch port and checks every critical route and API).
 *
 * Passes = every route renders and every API answers as expected,
 * even without env keys (routes must degrade gracefully, not 500).
 */
import { spawn } from 'node:child_process';

const PORT = 3499;
const BASE = `http://localhost:${PORT}`;

// [path, expected status(es), optional substring the body must contain]
const CHECKS = [
  // Pages
  ['/', [200], 'Pyadra'],
  ['/exhibitions', [200]],
  ['/exhibitions/galaxy', [200]],
  ['/exhibitions/galaxy/orbit', [200], 'Orbit 77'],
  ['/exhibitions/galaxy/ethernicapsule', [200]],
  ['/exhibitions/galaxy/ethernicapsule/compose', [200]],
  ['/exhibitions/galaxy/figurines', [200]],
  ['/exhibitions/galaxy/kangaroo-cleanup', [200]],
  ['/store', [200]],
  ['/manifesto', [200]],
  ['/legal/privacy', [200], 'Privacy'],
  ['/legal/terms', [200], 'Terms'],
  ['/transmission-confirmed?preview=1', [200]],
  ['/archive/not-a-uuid', [200], 'Signal not found'], // graceful error screen
  // Old URLs must redirect, not 404
  ['/projects/orbit', [301, 307, 308]],
  ['/ethernicapsule', [301, 307, 308]],
  // APIs — must answer, never crash
  ['/api/observer', [200]],
  ['/api/stats/orbit-fund', [200], 'total'],
  ['/api/stats/ethernicapsule', [200]],
  ['/api/donate', [200]], // GET health check
  ['/api/session?session_id=', [400]], // validates input
  ['/api/ethernicapsule/verify', [400, 405]], // GET not allowed / no body
];

function waitForServer(retries = 40) {
  return new Promise((resolve, reject) => {
    const tick = async (n) => {
      try {
        await fetch(BASE + '/');
        resolve();
      } catch {
        if (n <= 0) return reject(new Error('server never came up'));
        setTimeout(() => tick(n - 1), 500);
      }
    };
    tick(retries);
  });
}

const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d));
server.stderr.on('data', (d) => (serverLog += d));

let failures = 0;
try {
  await waitForServer();
  for (const [path, statuses, mustContain] of CHECKS) {
    try {
      const res = await fetch(BASE + path, { redirect: 'manual' });
      const okStatus = statuses.includes(res.status);
      let okBody = true;
      if (okStatus && mustContain) {
        const text = await res.text();
        okBody = text.includes(mustContain);
      }
      if (okStatus && okBody) {
        console.log(`  ✓ ${path} → ${res.status}`);
      } else {
        failures++;
        console.error(
          `  ✗ ${path} → ${res.status}` +
            (okStatus ? ` (missing "${mustContain}" in body)` : ` (expected ${statuses.join('/')})`)
        );
      }
    } catch (err) {
      failures++;
      console.error(`  ✗ ${path} → ${err.message}`);
    }
  }
} catch (err) {
  failures++;
  console.error(`Smoke aborted: ${err.message}\n--- server log ---\n${serverLog.slice(-2000)}`);
} finally {
  server.kill('SIGTERM');
}

if (failures > 0) {
  console.error(`\nSMOKE FAILED — ${failures} check(s) broken. Do not deploy.`);
  process.exit(1);
}
console.log(`\nSMOKE PASSED — ${CHECKS.length} checks green. Safe to deploy.`);
