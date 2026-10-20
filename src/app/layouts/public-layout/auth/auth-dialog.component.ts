import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { Account, AuthDialogService, AuthView, firstName } from '../../../core/auth';
import { sizedImage } from '../../../core/catalog';
import { CodeFormComponent } from './code-form.component';
import { ForgotFormComponent } from './forgot-form.component';
import { RegisterFormComponent } from './register-form.component';
import { SignInFormComponent } from './sign-in-form.component';

const WELCOME_CLOSE_MS = 2600;

interface AsideCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly benefits: readonly string[];
}

const MEMBER_BENEFITS = ['Your wishlist, saved on every device', 'Early access to Sale and private events', 'Faster checkout and order tracking'];

const ASIDE: Record<AuthView, AsideCopy> = {
  'sign-in': { eyebrow: 'Members', title: 'Your world of luxury, in one place', benefits: MEMBER_BENEFITS },
  welcome: { eyebrow: 'Members', title: 'Your world of luxury, in one place', benefits: MEMBER_BENEFITS },
  register: {
    eyebrow: 'Join VESTRA',
    title: 'Be first to the new season',
    benefits: ['Tailored new arrivals from the houses you love', 'Early access to Sale and private events', 'Your wishlist, saved on every device']
  },
  code: {
    eyebrow: 'Secure sign-in',
    title: 'No password? No problem.',
    benefits: ['A 6-digit code, valid for 10 minutes', 'Nothing to remember', 'Works for new and existing accounts']
  },
  forgot: {
    eyebrow: 'Account help',
    title: 'Back in, in a moment',
    benefits: ['A reset link straight to your inbox', 'Your wishlist and bag stay as they are', 'Or skip it with a one-time code']
  }
};

const TITLES: Record<AuthView, string> = {
  'sign-in': 'Welcome to VESTRA',
  register: 'Welcome to VESTRA',
  code: 'Continue with a one-time code',
  forgot: 'Forgot your password?',
  welcome: ''
};

// Farfetch's sign-in pop-up, on the native <dialog>: showModal() gives the
// top layer, the backdrop, a focus trap, Esc to close and an inert page for
// free. Editorial photography on the left from desktop up; a full-screen
// sheet on phones.
@Component({
  selector: 'app-auth-dialog',
  imports: [SignInFormComponent, RegisterFormComponent, CodeFormComponent, ForgotFormComponent],
  template: `
    <dialog
      #dialog
      class="m-auto h-dvh max-h-none w-full max-w-none overflow-hidden bg-canvas p-0 text-ink backdrop:bg-black/60 motion-safe:animate-dialog-in motion-safe:backdrop:animate-fade-in sm:h-auto sm:max-h-[min(54rem,calc(100dvh-4rem))] sm:w-[calc(100%-4rem)] sm:max-w-lg lg:max-w-5xl"
      aria-labelledby="auth-title"
      (close)="state.close()"
      (click)="closeOnBackdrop($event)"
    >
      @if (state.view(); as view) {
        <div class="grid h-full lg:grid-cols-[5fr_6fr]">
          <aside class="relative hidden overflow-hidden bg-ink text-canvas lg:block" aria-hidden="true">
            <img [src]="image" alt="" class="absolute inset-0 h-full w-full object-cover motion-safe:animate-ken-burns" />
            <span class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20"></span>
            <div class="relative flex h-full flex-col justify-between p-10">
              <p class="text-xl font-light uppercase tracking-[0.08em]">Vestra</p>
              @let copy = aside();
              <div class="motion-safe:animate-fade-in" [attr.data-view]="view">
                <p class="label-caps opacity-80">{{ copy.eyebrow }}</p>
                <p class="text-headline mt-3 max-w-xs">{{ copy.title }}</p>
                <ul class="mt-8 grid gap-3 text-sm">
                  @for (benefit of copy.benefits; track benefit) {
                    <li class="flex items-center gap-3">
                      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 12 5 5 9-10" /></svg>
                      {{ benefit }}
                    </li>
                  }
                </ul>
              </div>
            </div>
          </aside>

          <div class="relative flex max-h-dvh flex-col overflow-y-auto px-6 pb-10 pt-16 sm:max-h-[min(54rem,calc(100dvh-4rem))] sm:px-12">
            <button type="button" class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center transition-colors hover:text-muted" aria-label="Close" (click)="state.close()">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>

            @if (view === 'welcome') {
              @if (welcome(); as account) {
                <div class="flex flex-1 flex-col items-center justify-center py-12 text-center" role="status">
                  <svg class="h-16 w-16 -rotate-90" viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true">
                    <circle cx="26" cy="26" r="25" pathLength="1" class="[stroke-dasharray:1] motion-safe:animate-draw motion-safe:[stroke-dashoffset:1]" />
                    <path d="m16 27 7 7 13-15" transform="rotate(90 26 26)" pathLength="1" class="[stroke-dasharray:1] motion-safe:animate-draw motion-safe:[animation-delay:0.45s] motion-safe:[stroke-dashoffset:1]" />
                  </svg>
                  <p class="label-caps mt-8 text-muted">{{ account.provider === 'email' || account.provider === 'code' ? 'Signed in' : 'Signed in with ' + account.provider }}</p>
                  <h2 id="auth-title" class="text-headline mt-3">Welcome, {{ greeting() }}</h2>
                  <p class="mt-3 text-sm text-muted">{{ account.email }}</p>
                  <button type="button" class="btn btn-primary mt-10" (click)="state.close()">Continue shopping</button>
                </div>
              }
            } @else {
              <header class="mb-8">
                @if (view === 'code' || view === 'forgot') {
                  <button type="button" class="label-caps mb-6 flex items-center gap-2 text-muted transition-colors hover:text-ink" (click)="state.open('sign-in')">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
                    Back to sign in
                  </button>
                }
                <h2 id="auth-title" class="text-headline">{{ title() }}</h2>
              </header>

              @if (view === 'sign-in' || view === 'register') {
                <div class="mb-8 grid grid-cols-2 border-b border-line" role="tablist" aria-label="Sign in or register">
                  @for (tab of tabs; track tab.id) {
                    <button
                      type="button"
                      role="tab"
                      class="label-caps -mb-px border-b py-4 transition-colors"
                      [class.border-ink]="view === tab.id"
                      [class.border-transparent]="view !== tab.id"
                      [class.text-muted]="view !== tab.id"
                      [attr.aria-selected]="view === tab.id"
                      (click)="state.open(tab.id)"
                    >{{ tab.label }}</button>
                  }
                </div>
              }

              <div class="motion-safe:animate-fade-in">
                @switch (view) {
                  @case ('sign-in') {
                    <app-sign-in-form (done)="finish($event)" />
                  }
                  @case ('register') {
                    <app-register-form (done)="finish($event)" />
                  }
                  @case ('code') {
                    <app-code-form (done)="finish($event)" />
                  }
                  @case ('forgot') {
                    <app-forgot-form />
                  }
                }
              </div>
            }
          </div>
        </div>
      }
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthDialogComponent {
  protected readonly state = inject(AuthDialogService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly image = sizedImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80', 900);
  protected readonly tabs: ReadonlyArray<{ readonly id: AuthView; readonly label: string }> = [
    { id: 'sign-in', label: 'Sign in' },
    { id: 'register', label: 'Register' }
  ];

  protected readonly welcome = signal<Account | null>(null);
  protected readonly greeting = computed(() => firstName(this.welcome()?.name ?? ''));
  protected readonly aside = computed(() => ASIDE[this.state.view() ?? 'sign-in']);
  protected readonly title = computed(() => TITLES[this.state.view() ?? 'sign-in']);

  private closeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // The service decides; the browser's dialog follows (browser-only, so
    // it never runs during server rendering).
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      const open = this.state.view() !== null;
      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.closeTimer));
  }

  protected finish(account: Account): void {
    this.welcome.set(account);
    this.state.open('welcome');
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      if (this.state.view() === 'welcome') {
        this.state.close();
      }
    }, WELCOME_CLOSE_MS);
  }

  // A click on the dialog element itself is a click on its backdrop.
  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.state.close();
    }
  }
}
