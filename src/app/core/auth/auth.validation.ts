// Form rules shared by the dialog and the AuthService, so the UI and the
// "server" never disagree about what a valid email or password is.

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// The message to show under an email field; empty when it's fine.
export function emailError(value: string): string {
  if (!value.trim()) {
    return 'Enter your email address.';
  }
  return isEmail(value) ? '' : 'Enter a valid email address, like name@example.com.';
}

export interface PasswordCheck {
  readonly id: 'length' | 'letter' | 'number';
  readonly label: string;
  readonly met: boolean;
}

const PASSWORD_RULES: ReadonlyArray<{ readonly id: PasswordCheck['id']; readonly label: string; readonly test: (value: string) => boolean }> = [
  { id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { id: 'letter', label: 'A letter', test: (value) => /[a-z]/i.test(value) },
  { id: 'number', label: 'A number', test: (value) => /\d/.test(value) }
];

export function passwordChecks(value: string): PasswordCheck[] {
  return PASSWORD_RULES.map((rule) => ({ id: rule.id, label: rule.label, met: rule.test(value) }));
}

export function isValidPassword(value: string): boolean {
  return passwordChecks(value).every((check) => check.met);
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const STRENGTH_LABELS: Record<PasswordStrength, string> = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };

// One point per rule met; a valid password earns the fourth with length
// (12+) or with mixed case and a symbol.
export function passwordStrength(value: string): PasswordStrength {
  if (!value) {
    return 0;
  }
  const met = passwordChecks(value).filter((check) => check.met).length;
  const bonus = value.length >= 12 || (/[a-z]/.test(value) && /[A-Z]/.test(value) && /[^a-z0-9]/i.test(value));
  return Math.max(1, met + (met === 3 && bonus ? 1 : 0)) as PasswordStrength;
}

// "alex.morgan@gmail.com" → "Alex": a greeting for passwordless accounts.
export function nameFromEmail(email: string): string {
  const first = normalizeEmail(email).split('@')[0].split(/[._\-+0-9]/).find(Boolean) ?? 'there';
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
