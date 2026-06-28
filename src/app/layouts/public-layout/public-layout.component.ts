import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Notification Bar -->
    <div class="w-full bg-black text-white py-2.5 px-4 text-center text-[11px] font-medium tracking-widest uppercase">
      Enjoy Free Shipping on orders over $200
    </div>

    <!-- Sticky Header -->
    <header class="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-4 md:px-10">

        <!-- Main Nav Row: 3-column grid keeps logo perfectly centered -->
        <div class="grid grid-cols-3 items-center py-4">

          <!-- Left: desktop nav / mobile hamburger -->
          <div>
            <nav class="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.14em]">
              <a routerLink="/womenswear" routerLinkActive="underline" class="underline-offset-4 hover:underline transition-all">Womenswear</a>
              <a routerLink="/menswear" routerLinkActive="underline" class="underline-offset-4 hover:underline transition-all">Menswear</a>
              <a routerLink="/kids" routerLinkActive="underline" class="underline-offset-4 hover:underline transition-all">Kidswear</a>
            </nav>
            <button class="lg:hidden" aria-label="Open menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Center: Logo -->
          <div class="flex justify-center">
            <a routerLink="/" class="text-2xl md:text-3xl font-black tracking-tighter uppercase select-none">FARFETCH</a>
          </div>

          <!-- Right: utility icons -->
          <div class="flex items-center justify-end gap-5">
            <button aria-label="Account" class="hidden md:flex hover:opacity-60 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button aria-label="Wishlist" class="hover:opacity-60 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button aria-label="Shopping bag" class="relative hover:opacity-60 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              @if (cart.total() > 0) {
                <span class="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" aria-live="polite">{{ cart.total() }}</span>
              }
            </button>
          </div>
        </div>

        <!-- Search bar row (desktop only) -->
        <div class="hidden md:block pb-4">
          <div class="relative max-w-xl mx-auto">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              class="w-full bg-zinc-100 border-none rounded-none py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-black placeholder:text-zinc-400 outline-none"
              placeholder="What are you looking for?"
              type="search"
              aria-label="Search products"
            />
          </div>
        </div>

      </div>
    </header>

    <!-- Page content -->
    <main class="mx-auto max-w-7xl px-4 md:px-10">
      <router-outlet />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-zinc-100 mt-20 py-16 px-4 md:px-10">
      <div class="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h5 class="font-bold uppercase mb-6 text-[11px] tracking-widest">Customer Service</h5>
          <ul class="space-y-3 text-xs text-zinc-500">
            <li><a href="#" class="hover:text-black transition-colors">Contact Us</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Shipping &amp; Delivery</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Returns &amp; Refunds</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Payment &amp; Pricing</a></li>
            <li><a href="#" class="hover:text-black transition-colors">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold uppercase mb-6 text-[11px] tracking-widest">About Farfetch</h5>
          <ul class="space-y-3 text-xs text-zinc-500">
            <li><a href="#" class="hover:text-black transition-colors">About Us</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Investors</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Careers</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Affiliate Program</a></li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold uppercase mb-6 text-[11px] tracking-widest">Legal &amp; Cookies</h5>
          <ul class="space-y-3 text-xs text-zinc-500">
            <li><a href="#" class="hover:text-black transition-colors">Terms &amp; Conditions</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-black transition-colors">Accessibility</a></li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold uppercase mb-6 text-[11px] tracking-widest">Mobile App</h5>
          <p class="text-xs text-zinc-500 mb-5 leading-relaxed">Experience luxury fashion on the go with the Farfetch app.</p>
          <div class="flex flex-col gap-2">
            <div class="w-32 h-9 bg-zinc-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-tight text-zinc-600">App Store</div>
            <div class="w-32 h-9 bg-zinc-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-tight text-zinc-600">Google Play</div>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-7xl mt-12 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[10px] text-zinc-400 uppercase tracking-widest">© 2024 FARFETCH UK LIMITED. ALL RIGHTS RESERVED.</p>
        <span class="text-[11px] font-black tracking-tighter uppercase text-zinc-300 select-none">FARFETCH</span>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {
  protected readonly cart = inject(CartService);
}
