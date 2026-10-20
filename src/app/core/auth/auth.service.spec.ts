import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService, DEMO_ACCOUNT } from './auth.service';

// No waiting in tests.
class InstantAuthService extends AuthService {
  protected override latencyMs = 0;
}

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe('AuthService', () => {
  beforeEach(() => vi.stubGlobal('localStorage', new MemoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it('signs in the demo account', async () => {
    const auth = new InstantAuthService();
    const result = await auth.signIn(' Demo@Farfetch.com ', DEMO_ACCOUNT.password);
    expect(result.ok).toBe(true);
    expect(auth.account()?.name).toBe(DEMO_ACCOUNT.name);
  });

  it('registers, signs out and signs back in; the session survives a reload', async () => {
    const auth = new InstantAuthService();
    expect((await auth.register('Sam Lee', 'sam@example.com', 'secret123')).ok).toBe(true);
    expect(new InstantAuthService().account()?.email).toBe('sam@example.com');

    auth.signOut();
    expect(auth.signedIn()).toBe(false);
    expect(new InstantAuthService().account()).toBeNull();

    expect(await auth.signIn('sam@example.com', 'wrong-pass1')).toEqual({ ok: false, error: expect.stringMatching(/Incorrect password/) });
    expect((await auth.signIn('SAM@example.com', 'secret123')).ok).toBe(true);
  });

  it('never stores the password itself', async () => {
    await new InstantAuthService().register('Sam Lee', 'sam@example.com', 'secret123');
    expect(localStorage.getItem('farfetch.accounts.v1')).not.toContain('secret123');
  });

  it('refuses duplicates, unknown emails and weak passwords', async () => {
    const auth = new InstantAuthService();
    await auth.register('Sam Lee', 'sam@example.com', 'secret123');
    expect((await auth.register('Sam', 'sam@example.com', 'another123')).ok).toBe(false);
    expect((await auth.signIn('nobody@example.com', 'secret123')).ok).toBe(false);
    expect((await auth.register('Kim', 'kim@example.com', 'short')).ok).toBe(false);
  });

  it('signs in with a one-time code, once', async () => {
    const auth = new InstantAuthService();
    const code = await auth.requestCode('jo.doe@example.com');
    expect(code).toMatch(/^\d{6}$/);
    expect((await auth.verifyCode(code === '000000' ? '111111' : '000000')).ok).toBe(false);

    const result = await auth.verifyCode(code);
    expect(result.ok && result.account).toEqual({ name: 'Jo', email: 'jo.doe@example.com', provider: 'code' });
    expect((await auth.verifyCode(code)).ok).toBe(false);
    // A passwordless account can't sign in with a password.
    expect(await auth.signIn('jo.doe@example.com', 'anything1')).toEqual({ ok: false, error: expect.stringMatching(/one-time code/) });
  });

  it('continues with a social provider', async () => {
    const auth = new InstantAuthService();
    const result = await auth.continueWith('apple');
    expect(result.ok && result.account.provider).toBe('apple');
  });
});
