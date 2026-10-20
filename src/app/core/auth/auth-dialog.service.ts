import { Injectable, signal } from '@angular/core';
import { AuthView } from './auth.model';

// Opens the sign-in dialog from anywhere (the header's account icon, the
// mobile menu) and remembers which screen it shows. Null means closed.
@Injectable({ providedIn: 'root' })
export class AuthDialogService {
  private readonly current = signal<AuthView | null>(null);

  readonly view = this.current.asReadonly();
  // The email typed so far, carried from one screen to the next.
  readonly email = signal('');

  open(view: AuthView = 'sign-in'): void {
    this.current.set(view);
  }

  close(): void {
    this.current.set(null);
  }
}
