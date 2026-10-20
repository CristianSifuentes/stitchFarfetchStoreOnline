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
      eyebrow: $localize`:@@dept.partySeason:The Party Season`,
      title: $localize`:@@dept.women.campaign.title:Dressed for the occasion`,
      text: $localize`:@@dept.women.campaign.text:Liquid silk gowns, sculpted heels and jewelry that catches the light, from Valentino, Saint Laurent, Messika and more.`,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjaLgmMaSJovV9Ieb50yQtDYIOY2HMVUWIvsFa5O-9RMpCllP9crxEAsRLkXY-lI_TbDIeoT4p_e_FHTnFiQp3DcaPlOk0z6YL8VB2vsgMVvfla0-lIG1vHBHj8gKWm-cNs0knGbPLW2GiGZNe1m8LkFHEHk5ePMsYrXUBFEjFARs6I1ESjj66-Xq0tZJW4WgJA_RxZYYcrraVFjy0orhjkb0fnDHyrhAYpxQ5bkzUhZSVQdZdO9ljeIojmkJ7jgjQltiZtVYEu64o',
      alt: $localize`:@@dept.women.campaign.alt:Editorial portrait of a woman in a pleated couture gown`,
      edit: 'party'
    },
    trends: [
      { label: $localize`:@@dept.women.trend1:Special Gifts`, queryParams: { edit: 'gifts' } },
      { label: $localize`:@@dept.women.trend2:Little Luxuries`, queryParams: { edit: 'gifts', sort: 'price-asc', category: 'accessories' } },
      { label: $localize`:@@dept.women.trend3:Statement Shoes`, queryParams: { category: 'shoes' } },
      { label: 'Valentino', queryParams: { designer: 'Valentino' } }
    ],
    editorial: {
      eyebrow: $localize`:@@edit.winter:The Winter Edit`,
      title: $localize`:@@dept.women.editorial.title:Soft power`,
      text: $localize`:@@dept.women.editorial.text:Double-faced cashmere, heritage gabardine and boots built for the city: the coats and layers that carry the season.`,
      image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=80',
      alt: $localize`:@@dept.women.editorial.alt:A woman in a long check wool coat on a city street`,
      edit: 'winter'
    },
    brands: ['Bottega Veneta', 'Saint Laurent', 'Chloé']
  },
  menswear: {
    campaign: {
      eyebrow: $localize`:@@dept.winterSeason:The Winter Season`,
      title: $localize`:@@dept.men.campaign.title:Built for the cold`,
      text: $localize`:@@dept.men.campaign.text:Overcoats, technical parkas, fine knitwear and lace-up boots from Saint Laurent, Stone Island, Brunello Cucinelli and more.`,
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80',
      alt: $localize`:@@dept.men.campaign.alt:A man in a tailored overcoat in the city`,
      edit: 'winter'
    },
    trends: [
      { label: $localize`:@@dept.men.trend1:Gifts for Him`, queryParams: { edit: 'gifts' } },
      { label: $localize`:@@dept.men.trend2:Evening Tailoring`, queryParams: { edit: 'party', category: 'clothing' } },
      { label: $localize`:@@dept.men.trend3:Boots & Brogues`, queryParams: { category: 'shoes' } },
      { label: 'Saint Laurent', queryParams: { designer: 'Saint Laurent' } }
    ],
    editorial: {
      eyebrow: $localize`:@@edit.heritage:Modern Heritage`,
      title: $localize`:@@dept.men.editorial.title:The classics, reconsidered`,
      text: $localize`:@@dept.men.editorial.text:Windowpane check, hand-finished brogues and leather that ages well: the pieces menswear keeps coming back to.`,
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
      alt: $localize`:@@dept.men.editorial.alt:Menswear lookbook: clean monochrome layering`,
      edit: 'heritage'
    },
    brands: ['Saint Laurent', 'Prada', 'Ermenegildo Zegna']
  },
  kids: {
    campaign: {
      eyebrow: $localize`:@@dept.winterSeason:The Winter Season`,
      title: $localize`:@@dept.kids.campaign.title:Snow days, sorted`,
      text: $localize`:@@dept.kids.campaign.text:Rain jackets, teddy knits and cosy cardigans from Moncler Enfant, Bonpoint, Burberry Kids and more.`,
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1600&q=80',
      alt: $localize`:@@dept.kids.campaign.alt:A child in a navy cardigan and bright blue shorts`,
      edit: 'winter'
    },
    trends: [
      { label: $localize`:@@dept.kids.trend1:Gifts for Kids`, queryParams: { edit: 'gifts' } },
      { label: $localize`:@@dept.kids.trend2:Baby Essentials`, queryParams: { age: 'baby' } },
      { label: $localize`:@@dept.kids.trend3:Sneaker Season`, queryParams: { category: 'shoes' } },
      { label: 'Moncler Enfant', queryParams: { designer: 'Moncler Enfant' } }
    ],
    editorial: {
      eyebrow: $localize`:@@edit.party:Party Looks`,
      title: $localize`:@@dept.kids.editorial.title:Ready to celebrate`,
      text: $localize`:@@dept.kids.editorial.text:Twirly dresses, crisp polos and gingham shirts for birthdays, weddings and every party in between.`,
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80',
      alt: $localize`:@@dept.kids.editorial.alt:Two children laughing in costume at a party`,
      edit: 'party'
    },
    brands: ['Moncler Enfant', 'Stella McCartney Kids', 'Bonpoint']
  }
};
