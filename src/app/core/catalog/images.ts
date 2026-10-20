// Product photography helpers. Unsplash serves images through imgix, which
// can resize and crop on the fly, so one source photo is enough for every
// size the UI needs, and for the detail views of a product gallery.
const IMGIX_HOST = 'images.unsplash.com';

export interface GalleryImage {
  readonly src: string;
  readonly label: string;
}

// The same photo at a given width (cards ~600px, product page ~1200px).
// Other hosts are returned untouched.
export function sizedImage(url: string, width: number): string {
  return withParams(url, { w: String(width) });
}

// Full view plus two "detail shots": focal-point zooms on the upper and
// lower part of the same photo, the close-ups a luxury product page shows.
export function galleryFor(url: string, width = 1200): GalleryImage[] {
  const full = { src: sizedImage(url, width), label: $localize`:@@product.image.full:Full view` };
  if (!isImgix(url)) {
    return [full];
  }
  const detail = (y: number, zoom: number) =>
    withParams(url, {
      w: String(width),
      h: String(Math.round((width * 4) / 3)),
      fit: 'crop',
      crop: 'focalpoint',
      'fp-x': '0.5',
      'fp-y': String(y),
      'fp-z': String(zoom)
    });
  return [full, { src: detail(0.32, 2.2), label: $localize`:@@product.image.detail:Detail` }, { src: detail(0.7, 2.6), label: $localize`:@@product.image.closeUp:Close-up` }];
}

function isImgix(url: string): boolean {
  try {
    return new URL(url).hostname === IMGIX_HOST;
  } catch {
    return false;
  }
}

function withParams(url: string, params: Record<string, string>): string {
  if (!isImgix(url)) {
    return url;
  }
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    parsed.searchParams.set(key, value);
  }
  return parsed.toString();
}
