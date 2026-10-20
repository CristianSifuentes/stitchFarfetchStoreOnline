import { Injectable, computed, signal } from '@angular/core';
import { Account, AuthProvider, AuthResult } from './auth.model';
import { isEmail, isValidPassword, nameFromEmail, normalizeEmail } from './auth.validation';

const ACCOUNTS_KEY = 'vestra.accounts.v1';
const SESSION_KEY = 'vestra.session.v1';
const CODE_LIFETIME_MS = 10 * 60 * 1000;

// Always there, so the store can be tried without registering first.
export const DEMO_ACCOUNT = { name: 'Alex Morgan', email: 'demo@vestra.com', password: 'Vestra2026' } as const;

// What a social provider would hand back after its consent screen.
const SOCIAL_PROFILES: Record<'google' | 'apple' | 'facebook', { readonly name: string; readonly email: string }> = {
  google: { name: 'Alex Morgan', email: 'alex.morgan@gmail.com' },
  apple: { name: 'Alex Morgan', email: 'alex@privaterelay.appleid.com' },
  facebook: { name: 'Alex Morgan', email: 'alex.morgan@facebook.com' }
};

interface StoredAccount {
  readonly name: string;
  // Null for accounts created with a one-time code or a social provider.
  readonly passwordHash: string | null;
}

type StoredAccounts = Record<string, StoredAccount>;

// The customer's session. There is no backend: accounts live in this
// browser's localStorage and every call waits a moment, like a request
// would. Swapping in a real API means changing this class only; the
// dialog talks to it through AuthResult.
@Injectable({ providedIn: 'root' })
export class AuthService {
  protected latencyMs = 700;

  private readonly session = signal<Account | null>(readSession());
  private pendingCode: { readonly email: string; readonly code: string; readonly expires: number } | null = null;

  readonly account = this.session.asReadonly();
  readonly signedIn = computed(() => this.session() !== null);

  async signIn(email: string, password: string): Promise<AuthResult> {
    await this.wait();
    const key = normalizeEmail(email);
    if (key === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      return this.start({ name: DEMO_ACCOUNT.name, email: key, provider: 'email' });
    }
    const stored = readAccounts()[key];
    if (!stored) {
      return failure("We couldn't find an account with that email. Check it, or register.");
    }
    if (stored.passwordHash === null) {
      return failure('This account signs in without a password. Continue with a one-time code instead.');
    }
    if (stored.passwordHash !== (await hashPassword(key, password))) {
      return failure('Incorrect password. Try again, or reset it.');
    }
    return this.start({ name: stored.name, email: key, provider: 'email' });
  }

  async register(name: string, email: string, password: string): Promise<AuthResult> {
    await this.wait();
    const key = normalizeEmail(email);
    if (!name.trim() || !isEmail(key) || !isValidPassword(password)) {
      return failure('Check the highlighted fields and try again.');
    }
    const accounts = readAccounts();
    if (accounts[key] || key === DEMO_ACCOUNT.email) {
      return failure('An account already exists for this email. Sign in instead.');
    }
    writeAccounts({ ...accounts, [key]: { name: name.trim(), passwordHash: await hashPassword(key, password) } });
    return this.start({ name: name.trim(), email: key, provider: 'email' });
  }

  // Sends a 6-digit code. With no mail server, the code is returned so the
  // dialog can show it; a real backend would only email it.
  async requestCode(email: string): Promise<string> {
    await this.wait();
    const code = String(randomInt(1_000_000)).padStart(6, '0');
    this.pendingCode = { email: normalizeEmail(email), code, expires: Date.now() + CODE_LIFETIME_MS };
    return code;
  }

  async verifyCode(code: string): Promise<AuthResult> {
    await this.wait();
    const pending = this.pendingCode;
    if (!pending || Date.now() > pending.expires) {
      return failure('This code has expired. Send a new one.');
    }
    if (code !== pending.code) {
      return failure("That code isn't right. Check it and try again.");
    }
    this.pendingCode = null;
    return this.start({ name: this.ensureAccount(pending.email, nameFromEmail(pending.email)), email: pending.email, provider: 'code' });
  }

  // A real app would redirect to the provider's consent screen (OAuth) and
  // come back with a profile; here the profile arrives after a pause.
  async continueWith(provider: Exclude<AuthProvider, 'email' | 'code'>): Promise<AuthResult> {
    await this.wait(this.latencyMs * 1.5);
    const profile = SOCIAL_PROFILES[provider];
    return this.start({ name: this.ensureAccount(profile.email, profile.name), email: profile.email, provider });
  }

  // Always succeeds, so the form never reveals which emails have accounts.
  async requestPasswordReset(_email: string): Promise<void> {
    await this.wait();
  }

  signOut(): void {
    this.session.set(null);
    write(SESSION_KEY, null);
  }

  private start(account: Account): AuthResult {
    this.session.set(account);
    write(SESSION_KEY, account);
    return { ok: true, account };
  }

  // The stored name for an email, creating a passwordless account if needed.
  private ensureAccount(email: string, name: string): string {
    const accounts = readAccounts();
    if (accounts[email]) {
      return accounts[email].name;
    }
    if (email === DEMO_ACCOUNT.email) {
      return DEMO_ACCOUNT.name;
    }
    writeAccounts({ ...accounts, [email]: { name, passwordHash: null } });
    return name;
  }

  private wait(ms = this.latencyMs): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

function failure(error: string): AuthResult {
  return { ok: false, error };
}

// Demo-grade only: real password hashing happens on a server, with a slow
// algorithm (Argon2, bcrypt) and a random salt.
async function hashPassword(email: string, password: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${email}:${password}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomInt(max: number): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

function readSession(): Account | null {
  const value = read(SESSION_KEY);
  return isAccount(value) ? value : null;
}

function readAccounts(): StoredAccounts {
  const value = read(ACCOUNTS_KEY);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, account]) =>
        typeof account?.name === 'string' && (account.passwordHash === null || typeof account.passwordHash === 'string')
    )
  ) as StoredAccounts;
}

function writeAccounts(accounts: StoredAccounts): void {
  write(ACCOUNTS_KEY, accounts);
}

function isAccount(value: unknown): value is Account {
  const candidate = value as Partial<Account> | null;
  return (
    typeof candidate?.name === 'string' &&
    typeof candidate.email === 'string' &&
    ['email', 'code', 'google', 'apple', 'facebook'].includes(candidate.provider as string)
  );
}

function read(key: string): unknown {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Private mode or blocked storage: the session lasts for this visit.
  }
}
