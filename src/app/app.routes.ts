import { Routes } from '@angular/router';
import { Department } from './core/catalog/catalog.model';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

const department = () =>
  import('./features/department/pages/department-page.component').then((m) => m.DepartmentPageComponent);
const brands = () => import('./features/brands/pages/brands-page.component').then((m) => m.BrandsPageComponent);
const listing = () =>
  import('./features/listing/pages/product-listing-page.component').then((m) => m.ProductListingPageComponent);

// Each department has the same three pages (hub, listing, brands A–Z),
// so their routes are generated from one shape (Farfetch: /women, /women/items).
function departmentRoutes(path: string, id: Department): Routes {
  return [
    { path, loadComponent: department, data: { department: id }, title: titleFor(id) },
    { path: `${path}/items`, loadComponent: listing, data: { department: id }, title: `${titleFor(id)} · Shop all` },
    { path: `${path}/brands`, loadComponent: brands, data: { department: id }, title: `${titleFor(id)} · Brands` }
  ];
}

function titleFor(id: Department): string {
  return { womenswear: 'Womenswear', menswear: 'Menswear', kids: 'Kidswear' }[id] + ' | VESTRA';
}

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'VESTRA | Luxury Fashion',
        loadComponent: () => import('./features/home/pages/home-page.component').then((m) => m.HomePageComponent)
      },
      ...departmentRoutes('womenswear', 'womenswear'),
      ...departmentRoutes('menswear', 'menswear'),
      ...departmentRoutes('kids', 'kids'),
      { path: 'search', loadComponent: listing, data: { department: null }, title: 'Shop all | VESTRA' },
      {
        path: 'wishlist',
        title: 'Wishlist | VESTRA',
        loadComponent: () => import('./features/wishlist/pages/wishlist-page.component').then((m) => m.WishlistPageComponent)
      },
      {
        path: 'product/:id',
        title: 'Product | VESTRA',
        loadComponent: () => import('./features/product/pages/product-page.component').then((m) => m.ProductPageComponent)
      },
      {
        path: '**',
        title: 'Page not found | VESTRA',
        loadComponent: () => import('./features/not-found/pages/not-found-page.component').then((m) => m.NotFoundPageComponent)
      }
    ]
  }
];
