import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen">
      <header class="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a routerLink="/" class="text-xl font-extrabold tracking-tight">FARFETCH</a>
          <nav class="flex items-center gap-6 text-xs uppercase tracking-[0.16em]">
            <a routerLink="/women" routerLinkActive="font-bold">Womenswear</a>
            <a routerLink="/menswear" routerLinkActive="font-bold">Menswear</a>
            <a routerLink="/kids" routerLinkActive="font-bold">Kidswear</a>
          </nav>
          <p class="text-xs" aria-live="polite">Bag {{ cart.total() }}</p>
        </div>
      </header>
      <main class="mx-auto max-w-7xl p-6">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {
  protected readonly cart = inject(CartService);
}
