import { Department, ProductCategory } from '../../../core/catalog/catalog.model';

export interface DepartmentStory {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly category: ProductCategory;
}

// The editorial voice of each department. Structure is shared (one
// template renders all three); only the words and photography differ.
// Designer and category tiles take their images from the catalog itself,
// so they always match the products they lead to.
export interface DepartmentContent {
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly text: string;
    readonly image: string;
    readonly alt: string;
  };
  readonly designers: ReadonlyArray<{ readonly name: string; readonly eyebrow: string }>;
  readonly stories: readonly [DepartmentStory, DepartmentStory];
}

export const DEPARTMENT_CONTENT: Record<Department, DepartmentContent> = {
  womenswear: {
    hero: {
      eyebrow: 'SS24 Collection',
      title: 'The Modern Icon',
      text: 'The definitive edit of the season’s most coveted pieces from the world’s leading designers.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjaLgmMaSJovV9Ieb50yQtDYIOY2HMVUWIvsFa5O-9RMpCllP9crxEAsRLkXY-lI_TbDIeoT4p_e_FHTnFiQp3DcaPlOk0z6YL8VB2vsgMVvfla0-lIG1vHBHj8gKWm-cNs0knGbPLW2GiGZNe1m8LkFHEHk5ePMsYrXUBFEjFARs6I1ESjj66-Xq0tZJW4WgJA_RxZYYcrraVFjy0orhjkb0fnDHyrhAYpxQ5bkzUhZSVQdZdO9ljeIojmkJ7jgjQltiZtVYEu64o',
      alt: 'Editorial portrait of a woman in a pleated couture gown'
    },
    designers: [
      { name: 'Prada', eyebrow: 'New Season' },
      { name: 'Gucci', eyebrow: 'The Silk Edit' },
      { name: 'Saint Laurent', eyebrow: 'Evening Essentials' }
    ],
    stories: [
      {
        label: 'The Evening Edit',
        title: 'Liquid silks and sculpted silhouettes',
        description: 'Fluid dresses, polished heels and jewelry that catches the light, for every invitation of the season.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB47MBtUIRrT62AQ0B1-ouzK7sbb8t7aqsl1w2HEIIr3tw8zoOM1eLm_MZ9SP1EGx813FG6Hsua5Ztg-17cSOmy98Nlwx6QScO2jljwCV3IDkAlZq1HhjROt9mcPUKu_0higxAgVMLcm_LV5RycTwg6LVQBg_En414FIlDqlxSrEUX7xY1KprqJYhSgeyTiM2Z6IrQg5TgMfvXJ-A1Nwz-IyO-myFsqnLOBGjzkBN__qYVGPLhGwgWm3k_mKcpv-lk-D39D4_OQIxTm',
        category: 'clothing'
      },
      {
        label: 'Investment Pieces',
        title: 'Bags built to be kept',
        description: 'Structured totes and timeless leathers from the houses that defined them.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU6iVQQTlBx7KmhAUFCVEp-0y2VmYSdtvjGOkBZpFcPwyt9tiS5z4f2iHiR1mK2EZu1FBtU5gQdT2a43efM5TzlM8g2YT_VEL5vocc1Iee4B3bYddHnASog2WSK9jxq2fCSO3JIDAbqCDk2auN-WSzNon0sGpKKtNgQhAn8s-D5rVBXPlrZ-mdtzBrx4mV4ZbxVJyB4WxM4nvJa1qMOGnUlL3MHDVtXPX7qLP2VRD9nqo1hlbpbLhSNN3HUvqLCp5W4u85g8FB0EfT',
        category: 'bags'
      }
    ]
  },
  menswear: {
    hero: {
      eyebrow: 'Exclusive Collection',
      title: 'The Modern Gentleman',
      text: 'The season’s most coveted styles from world-class designers, curated for the discerning eye.',
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
      alt: 'Menswear lookbook: clean monochrome layering'
    },
    designers: [
      { name: 'Saint Laurent', eyebrow: 'New Season' },
      { name: 'Prada', eyebrow: 'Minimalist Aesthetic' },
      { name: 'Balenciaga', eyebrow: 'The Streetwear Icon' }
    ],
    stories: [
      {
        label: 'Office to Evening',
        title: 'Tailored layers that transition seamlessly',
        description: 'Sharp overcoats, fine knitwear and versatile footwear built for long city days.',
        image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80',
        category: 'clothing'
      },
      {
        label: 'Weekend City',
        title: 'Relaxed luxury with technical function',
        description: 'Statement sneakers, utility jackets and elevated essentials designed for movement.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
        category: 'shoes'
      }
    ]
  },
  kids: {
    hero: {
      eyebrow: 'Kidswear Edit',
      title: 'Mini Icons, Major Style',
      text: 'Premium essentials for babies, kids and teens: standout silhouettes, fine materials and playful details.',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1600&q=80',
      alt: 'Kids fashion lookbook in bright, playful colors'
    },
    designers: [
      { name: 'Burberry Kids', eyebrow: 'Heritage Outerwear' },
      { name: 'Moncler Enfant', eyebrow: 'Weather-Ready' },
      { name: 'Gucci Kids', eyebrow: 'Back to School' }
    ],
    stories: [
      {
        label: 'School Days',
        title: 'Polished layers for every forecast',
        description: 'Tailored coats, durable knits and premium shoes that stay sharp from morning class to after-school plans.',
        image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80',
        category: 'clothing'
      },
      {
        label: 'Weekend Play',
        title: 'Sneakers and sets made to move',
        description: 'Signature sneakers and easy layers for park days, city walks and everything in between.',
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80',
        category: 'shoes'
      }
    ]
  }
};
