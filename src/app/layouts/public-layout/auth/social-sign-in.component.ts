import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Account, AuthService } from '../../../core/auth';

type SocialProvider = 'google' | 'apple' | 'facebook';

const PROVIDERS: ReadonlyArray<{ readonly id: SocialProvider; readonly label: string; readonly icon: string }> = [
  {
    id: 'google',
    label: 'Google',
    icon: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
  },
  {
    id: 'apple',
    label: 'Apple',
    icon: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'
  }
];

// "Continue with Google / Apple / Facebook": monochrome glyphs on outlined
// buttons, so the providers sit inside the design system instead of
// bringing their own colors.
@Component({
  selector: 'app-social-sign-in',
  template: `
    <div class="flex items-center gap-4 text-muted" aria-hidden="true">
      <span class="h-px flex-1 bg-line"></span>
      <span class="label-caps" i18n="@@auth.or">Or</span>
      <span class="h-px flex-1 bg-line"></span>
    </div>
    <ul class="mt-6 grid gap-3">
      @for (provider of providers; track provider.id) {
        <li>
          <button type="button" class="btn btn-secondary group relative w-full" [disabled]="pending() !== null || disabled()" (click)="continueWith(provider.id)">
            @if (pending() === provider.id) {
              <span class="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" aria-hidden="true"></span>
              <ng-container i18n="@@auth.social.connecting">Connecting to {{ provider.label }}</ng-container>
            } @else {
              <svg class="absolute left-5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path [attr.d]="provider.icon" /></svg>
              <ng-container i18n="@@auth.social.continue">Continue with {{ provider.label }}</ng-container>
            }
          </button>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialSignInComponent {
  private readonly auth = inject(AuthService);

  // While the surrounding form is submitting.
  readonly disabled = input(false);
  readonly done = output<Account>();

  protected readonly providers = PROVIDERS;
  protected readonly pending = signal<SocialProvider | null>(null);

  protected async continueWith(provider: SocialProvider): Promise<void> {
    this.pending.set(provider);
    const result = await this.auth.continueWith(provider);
    this.pending.set(null);
    if (result.ok) {
      this.done.emit(result.account);
    }
  }
}
