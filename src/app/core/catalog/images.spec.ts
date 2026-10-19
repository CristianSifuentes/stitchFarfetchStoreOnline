import { describe, expect, it } from 'vitest';
import { galleryFor, sizedImage } from './images';

const unsplash = 'https://images.unsplash.com/photo-123?auto=format&fit=crop&w=900&q=80';
const other = 'https://lh3.googleusercontent.com/aida-public/abc';

describe('sizedImage', () => {
  it('rewrites the width of imgix photos and keeps the other params', () => {
    const url = new URL(sizedImage(unsplash, 600));
    expect(url.searchParams.get('w')).toBe('600');
    expect(url.searchParams.get('q')).toBe('80');
  });

  it('leaves other hosts untouched', () => {
    expect(sizedImage(other, 600)).toBe(other);
  });
});

describe('galleryFor', () => {
  it('builds a full view and two focal-point detail shots for imgix photos', () => {
    const gallery = galleryFor(unsplash);
    expect(gallery.map((image) => image.label)).toEqual(['Full view', 'Detail', 'Close-up']);
    const detail = new URL(gallery[1].src);
    expect(detail.searchParams.get('crop')).toBe('focalpoint');
    expect(detail.searchParams.get('fp-z')).toBe('2.2');
    expect(detail.searchParams.get('h')).toBe('1600');
  });

  it('falls back to the single photo elsewhere', () => {
    expect(galleryFor(other)).toEqual([{ src: other, label: 'Full view' }]);
  });
});
