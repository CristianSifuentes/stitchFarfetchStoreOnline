import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/pages/home-page.component').then((m) => m.HomePageComponent)
      },
      {
        path: 'womenswear',
        loadComponent: () => import('./features/womens/pages/womens-page.component').then((m) => m.WomensPageComponent)
      },
      {
        path: 'menswear',
        loadComponent: () => import('./features/mens/pages/mens-page.component').then((m) => m.MensPageComponent)
      },
      {
        path: 'kids',
        loadComponent: () => import('./features/kids/pages/kids-page.component').then((m) => m.KidsPageComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./features/product/pages/product-page.component').then((m) => m.ProductPageComponent)
      }
    ]
  }
];
