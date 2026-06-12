import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyGitHubOwner } from './github-owner-verification';

describe('verifyGitHubOwner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects requests without a bearer token', async () => {
 fix/5193-notification-ownership
    const result = await verifyGitHubOwner(new Request('http://localhost/api/notify'), 'octocat');
    const result = await verifyGitHubOwner(new Request('http://localhost/api/profile'), 'octocat');
 main

    expect(result).toEqual({
      verified: false,
      status: 401,
      message: 'GitHub authentication is required.',
    });
  });

 fix/5193-notification-ownership
  it('verifies a matching GitHub account without leaking or storing the token', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ login: 'OctoCat' }), { status: 200 }));
    const request = new Request('http://localhost/api/notify', {

  it('verifies a matching GitHub account', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ login: 'OctoCat' }), { status: 200 }));
    const request = new Request('http://localhost/api/profile', {
 main
      headers: { Authorization: 'Bearer caller-token' },
    });

    await expect(verifyGitHubOwner(request, 'octocat')).resolves.toEqual({ verified: true });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.github.com/user',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer caller-token' }),
        cache: 'no-store',
      })
    );
  });

  it('rejects a token belonging to a different GitHub account', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ login: 'attacker' }), { status: 200 })
    );
 fix/5193-notification-ownership
    const request = new Request('http://localhost/api/notify', {

    const request = new Request('http://localhost/api/profile', {
 main
      headers: { Authorization: 'Bearer attacker-token' },
    });

    const result = await verifyGitHubOwner(request, 'victim');

    expect(result).toMatchObject({ verified: false, status: 403 });
  });

 fix/5193-notification-ownership
  it('rejects invalid tokens with a controlled response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));
    const request = new Request('http://localhost/api/notify', {

  it('rejects invalid tokens without exposing them', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));
    const request = new Request('http://localhost/api/profile', {
 main
      headers: { Authorization: 'Bearer expired-token' },
    });

    const result = await verifyGitHubOwner(request, 'octocat');

    expect(result).toMatchObject({ verified: false, status: 401 });
    expect(JSON.stringify(result)).not.toContain('expired-token');
  });

  it('fails closed when GitHub ownership verification is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network failure'));
fix/5193-notification-ownership
    const request = new Request('http://localhost/api/notify', {

    const request = new Request('http://localhost/api/profile', {
 main
      headers: { Authorization: 'Bearer caller-token' },
    });

    await expect(verifyGitHubOwner(request, 'octocat')).resolves.toMatchObject({
      verified: false,
      status: 502,
    });
  });
});
