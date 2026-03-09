import { Injectable, computed, signal } from '@angular/core';
import { WomenItem } from '../models/women-item.model';

@Injectable({ providedIn: 'root' })
export class WomenStore {
  readonly spotlight = signal<WomenItem[]>([
    {
      id: 'w-prada-cleo',
      brand: 'Prada',
      title: 'Cleo brushed leather shoulder bag',
      price: 2950,
      image: 'https://images.unsplash.com/photo-1591348278999-ee1d0c5c7e9f?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-gucci-midi',
      brand: 'Gucci',
      title: 'GG-logo silk midi dress',
      price: 3400,
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-slp-heels',
      brand: 'Saint Laurent',
      title: 'Cassandre 110mm leather pumps',
      price: 1150,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-burberry-trench',
      brand: 'Burberry',
      title: 'The Kensington Heritage trench coat',
      price: 2490,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80'
    }
  ]);

  readonly arrivals = signal<WomenItem[]>([
    {
      id: 'w-bottega-hop',
      brand: 'Bottega Veneta',
      title: 'Small Hop leather tote bag',
      price: 4100,
      badge: 'New Season',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-loewe-flamenco',
      brand: 'Loewe',
      title: 'Flamenco Clutch Mini',
      price: 2250,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-jacquemus-dress',
      brand: 'Jacquemus',
      title: 'La Robe Bahia draped dress',
      price: 745,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-amina-muaddi',
      brand: 'Aminā Muaddi',
      title: 'Begum 95mm glass slingbacks',
      price: 1020,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-cartier-tank',
      brand: 'Cartier',
      title: 'Tank Must small model watch',
      price: 3300,
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-miumiu-cardigan',
      brand: 'Miu Miu',
      title: 'Cashmere cardigan jacket',
      price: 2150,
      image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-the-row-margaux',
      brand: 'The Row',
      title: 'Margaux 15 leather tote',
      price: 4390,
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'w-maxmara-ludmilla',
      brand: 'Max Mara',
      title: 'Ludmilla double-faced cashmere coat',
      price: 6850,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80'
    }
  ]);

  readonly categories = signal(['Dresses', 'Bags', 'Shoes', 'Accessories', 'Jewelry', 'Knitwear']);
  readonly activeCategory = signal('Dresses');

  readonly sortedArrivals = computed(() => this.arrivals());

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }
}
