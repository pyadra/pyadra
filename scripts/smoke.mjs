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
  ['/exhibitions', [301, 308], null], // the hall redirects to Galaxy while it's the only room
  ['/exhibitions/galaxy', [200]],
  ['/exhibitions/galaxy/orbit', [200], 'Orbit 77'],
  ['/exhibitions/galaxy/ethernicapsule', [200]], // showcase only now — app lives at eternicapsule.com
  ['/exhibitions/galaxy/figurines', [200]],
  ['/exhibitions/galaxy/kangaroo-cleanup', [200]],
  // every project's dashboard comes from one template (galaxy/[project])
  ['/exhibitions/galaxy/momentos-eternos', [200], 'Momentos Eternos'],
  ['/exhibitions/galaxy/urelit', [200], 'URELIT'],
  ['/exhibitions/galaxy/wemait', [200], 'WEMAIT'],
  ['/exhibitions/galaxy/byndi', [200], 'Byndi'],
  ['/exhibitions/galaxy/backmate', [200], 'BackMate'],
  ['/store', [200]],
  ['/team', [200], 'Eduardo'],
  ['/team/edu', [200], 'Eduardo'],
  ['/team/cris', [200], 'Cristian'],
  ['/eduardo', [301, 308], null],
  ['/api/vcard', [200], 'BEGIN:VCARD'],
  ['/api/vcard?c=cris', [200], 'Cristian Ruiz'],
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
  ['/api/donate', [200]], // GET health check
  ['/api/session?session_id=', [400]], // validates input
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

// Its own process group: `npx` forwards nothing, so killing the npx process
// leaves the real server alive — its open pipes then keep this script from
// ever exiting. We signal the whole group instead.
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
});
let serverLog = '';
server.stdout.on('data', (d) => (serverLog += d));
server.stderr.on('data', (d) => (serverLog += d));

let failures = 0;
try {
  await waitForServer();
  for (const [path, statuses, mustContain] of CHECKS) {
    try {
      const res = await fetch(BASE + path, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
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
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch {
    server.kill('SIGTERM'); // group already gone
  }
}

if (failures > 0) {
  console.error(`\nSMOKE FAILED — ${failures} check(s) broken. Do not deploy.`);
  process.exit(1);
}
console.log(`\nSMOKE PASSED — ${CHECKS.length} checks green. Safe to deploy.`);
process.exit(0); // don't wait on the server's pipes
