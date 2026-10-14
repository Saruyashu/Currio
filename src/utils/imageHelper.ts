/**
 * Image resolution and error fallback helpers for Curio Auction Marketplace.
 * Guarantees images display reliably in Vite Dev, Production Dist, and Vercel.
 */

// Universal luxury SVG placeholder for offline / network failure situations
export const INLINE_FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%2312151e"/><rect x="40" y="40" width="520" height="320" rx="12" fill="%231a1f2c" stroke="%23d4af37" stroke-width="2" stroke-dasharray="6,6"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="%23d4af37" font-family="sans-serif" font-size="20" font-weight="bold">CURIO COLLECTIBLES</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14">Curated Auction Item</text></svg>`;

export const LUXURY_FALLBACK_IMAGE = '/images/curio_hero_banner_1791467008185.jpg';

export function resolveImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return LUXURY_FALLBACK_IMAGE;
  }

  const trimmed = url.trim();

  // Normalize legacy /src/assets/images paths to standard /images/
  if (trimmed.startsWith('/src/assets/images/')) {
    const filename = trimmed.replace('/src/assets/images/', '');
    return `/images/${filename}`;
  }

  return trimmed;
}

/**
 * Robust onError handler for <img> elements.
 * Tries alternative paths before setting the universal fallback.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) {
  const img = event.currentTarget;
  const currentSrc = img.src;

  // Prevent infinite retry loop
  if (img.dataset.hasFailedTwice === 'true') {
    return;
  }

  if (img.dataset.hasFailedOnce === 'true') {
    img.dataset.hasFailedTwice = 'true';
    img.src = customFallback || INLINE_FALLBACK_SVG;
    return;
  }

  img.dataset.hasFailedOnce = 'true';

  // If failed with /images/..., try fallback to /src/assets/images/...
  if (currentSrc.includes('/images/')) {
    const filename = currentSrc.substring(currentSrc.lastIndexOf('/') + 1);
    img.src = `/src/assets/images/${filename}`;
    return;
  }

  // If failed with /src/assets/images/..., try fallback to /images/...
  if (currentSrc.includes('/src/assets/images/')) {
    const filename = currentSrc.substring(currentSrc.lastIndexOf('/') + 1);
    img.src = `/images/${filename}`;
    return;
  }

  img.src = customFallback || LUXURY_FALLBACK_IMAGE;
}
