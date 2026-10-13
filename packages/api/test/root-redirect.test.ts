/**
 * Bare origin `/` redirects to the dashboard when the UI is enabled, and stays 404 when it is not.
 */
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.DOMAIN = 'test.example';
process.env.API_KEYS = 'admin-root-redirect-key';
process.env.IMAP_USER = 'agent@test.example';
process.env.IMAP_PASS = 'imap-secret';
process.env.SMTP_USER = 'agent@test.example';
process.env.SMTP_PASS = 'smtp-secret';
process.env.TASK_SIGNING_SECRET = '01234567890123456789012345678901';
process.env.DATA_DIR = mkdtempSync(join(tmpdir(), 'oae-root-redirect-'));

const { describe, expect, test } = await import('bun:test');
const { createApp } = await import('../src/app.ts');

describe('GET /', () => {
  test('redirects to /ui when the UI is enabled', async () => {
    const res = await createApp({ uiEnabled: true }).request('/');
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/ui');
  });

  test('is not routed when the UI is disabled', async () => {
    const res = await createApp({ uiEnabled: false }).request('/');
    expect(res.status).toBe(404);
  });
});
