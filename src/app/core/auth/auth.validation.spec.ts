import { describe, expect, it } from 'vitest';
import { emailError, firstName, isValidPassword, nameFromEmail, passwordChecks, passwordStrength } from './auth.validation';

describe('emailError', () => {
  it('asks for an email, then for a valid one', () => {
    expect(emailError('  ')).toBe('Enter your email address.');
    expect(emailError('alex@')).toMatch(/valid email/);
    expect(emailError(' Alex@Example.com ')).toBe('');
  });
});

describe('passwords', () => {
  it('checks length, a letter and a number', () => {
    expect(passwordChecks('abc').map((check) => check.met)).toEqual([false, true, false]);
    expect(isValidPassword('abcdefg1')).toBe(true);
    expect(isValidPassword('12345678')).toBe(false);
  });

  it('rates strength from weak to strong', () => {
    expect(passwordStrength('')).toBe(0);
    expect(passwordStrength('a')).toBe(1);
    expect(passwordStrength('abcdefg1')).toBe(3);
    expect(passwordStrength('abcdefghijk1')).toBe(4);
    expect(passwordStrength('Abcdef1!')).toBe(4);
  });
});

describe('names', () => {
  it('greets passwordless accounts by the first part of their email', () => {
    expect(nameFromEmail('alex.morgan@gmail.com')).toBe('Alex');
    expect(nameFromEmail('2024_sam@x.com')).toBe('Sam');
    expect(firstName('Alex Morgan')).toBe('Alex');
  });
});
