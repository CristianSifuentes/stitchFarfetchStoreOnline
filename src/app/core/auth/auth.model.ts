// How a customer got in: a password, a one-time code or a social account.
export type AuthProvider = 'email' | 'code' | 'google' | 'apple' | 'facebook';

export interface Account {
  readonly name: string;
  readonly email: string;
  readonly provider: AuthProvider;
}

export type AuthResult = { readonly ok: true; readonly account: Account } | { readonly ok: false; readonly error: string };

// The screens of the sign-in dialog (Farfetch: "Sign in", "Register",
// "Continue with a one-time code", "Forgot your password?").
export type AuthView = 'sign-in' | 'register' | 'code' | 'forgot' | 'welcome';

// VESTRA Access, the loyalty programme (Farfetch: Bronze, Silver, Gold,
// Platinum, Private). Every member starts at Bronze; tiers are earned by
// spending, which this store doesn't track yet.
export const ACCESS_TIER = $localize`:@@auth.tier.bronze:Bronze`;
