import { Params } from '@angular/router';
import { Department, ProductEdit } from '../../../core/catalog/catalog.model';

export interface DepartmentFeature {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly image: string;
  readonly alt: string;
  // The edit the feature leads to (and whose pieces it shows).
  readonly edit: ProductEdit;
}

export interface TrendTile {
  readonly label: string;
  // Listing filters; the tile is pictured by the newest matching piece.
  readonly queryParams: Params;
}

// The editorial voice of each department, in the order of Farfetch's
// department hub: a seasonal campaign, the trending edits, one editorial
// story and the trending houses. Structure is shared (one template renders
// all three); products, counts and tile images come from the catalog.
export interface DepartmentContent {
  readonly campaign: DepartmentFeature;
  readonly trends: readonly [TrendTile, TrendTile, TrendTile, TrendTile];
  readonly editorial: DepartmentFeature;
  readonly brands: readonly [string, string, string];
}

export const DEPARTMENT_CONTENT: Record<Department, DepartmentContent> = {
  womenswear: {
    campaign: {
      eyebrow: 'The Party Season',
      title: 'Dressed for the occasion',
      text: 'Liquid silk gowns, sculpted heels and jewelry that catches the light, from Valentino, Saint Laurent, Messika and more.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjaLgmMaSJovV9Ieb50yQtDYIOY2HMVUWIvsFa5O-9RMpCllP9crxEAsRLkXY-lI_TbDIeoT4p_e_FHTnFiQp3DcaPlOk0z6YL8VB2vsgMVvfla0-lIG1vHBHj8gKWm-cNs0knGbPLW2GiGZNe1m8LkFHEHk5ePMsYrXUBFEjFARs6I1ESjj66-Xq0tZJW4WgJA_RxZYYcrraVFjy0orhjkb0fnDHyrhAYpxQ5bkzUhZSVQdZdO9ljeIojmkJ7jgjQltiZtVYEu64o',
      alt: 'Editorial portrait of a woman in a pleated couture gown',
      edit: 'party'
    },
    trends: [
      { label: 'Special Gifts', queryParams: { edit: 'gifts' } },
      { label: 'Little Luxuries', queryParams: { edit: 'gifts', sort: 'price-asc', category: 'accessories' } },
      { label: 'Statement Shoes', queryParams: { category: 'shoes' } },
      { label: 'Valentino', queryParams: { designer: 'Valentino' } }
    ],
    editorial: {
      eyebrow: 'The Winter Edit',
      title: 'Soft power',
      text: 'Double-faced cashmere, heritage gabardine and boots built for the city: the coats and layers that carry the season.',
      image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=80',
      alt: 'A woman in a long check wool coat on a city street',
      edit: 'winter'
    },
    brands: ['Bottega Veneta', 'Saint Laurent', 'Chloé']
  },
  menswear: {
    campaign: {
      eyebrow: 'The Winter Season',
      title: 'Built for the cold',
      text: 'Overcoats, technical parkas, fine knitwear and lace-up boots from Saint Laurent, Stone Island, Brunello Cucinelli and more.',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80',
      alt: 'A man in a tailored overcoat in the city',
      edit: 'winter'
    },
    trends: [
      { label: 'Gifts for Him', queryParams: { edit: 'gifts' } },
      { label: 'Evening Tailoring', queryParams: { edit: 'party', category: 'clothing' } },
      { label: 'Boots & Brogues', queryParams: { category: 'shoes' } },
      { label: 'Saint Laurent', queryParams: { designer: 'Saint Laurent' } }
    ],
    editorial: {
      eyebrow: 'Modern Heritage',
      title: 'The classics, reconsidered',
      text: 'Windowpane check, hand-finished brogues and leather that ages well: the pieces menswear keeps coming back to.',
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
      alt: 'Menswear lookbook: clean monochrome layering',
      edit: 'heritage'
    },
    brands: ['Saint Laurent', 'Prada', 'Ermenegildo Zegna']
  },
  kids: {
    campaign: {
      eyebrow: 'The Winter Season',
      title: 'Snow days, sorted',
      text: 'Rain jackets, teddy knits and cosy cardigans from Moncler Enfant, Bonpoint, Burberry Kids and more.',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1600&q=80',
      alt: 'A child in a navy cardigan and bright blue shorts',
      edit: 'winter'
    },
    trends: [
      { label: 'Gifts for Kids', queryParams: { edit: 'gifts' } },
      { label: 'Baby Essentials', queryParams: { age: 'baby' } },
      { label: 'Sneaker Season', queryParams: { category: 'shoes' } },
      { label: 'Moncler Enfant', queryParams: { designer: 'Moncler Enfant' } }
    ],
    editorial: {
      eyebrow: 'Party Looks',
      title: 'Ready to celebrate',
      text: 'Twirly dresses, crisp polos and gingham shirts for birthdays, weddings and every party in between.',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Two children laughing in costume at a party',
      edit: 'party'
    },
    brands: ['Moncler Enfant', 'Stella McCartney Kids', 'Bonpoint']
  }
};
