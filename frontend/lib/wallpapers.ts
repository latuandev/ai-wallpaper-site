import 'server-only';

import type { Wallpaper } from '../data/wallpapers';

interface PaginatedWallpaperResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Wallpaper[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWallpaper(value: unknown): value is Wallpaper {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'number' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number' &&
    typeof value.quality === 'string' &&
    (value.orientation === 'landscape' ||
      value.orientation === 'portrait' ||
      value.orientation === 'ultrawide') &&
    typeof value.aspectRatio === 'string' &&
    typeof value.imageUrl === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function isPaginatedWallpaperResponse(
  value: unknown,
): value is PaginatedWallpaperResponse {
  return (
    isRecord(value) &&
    typeof value.count === 'number' &&
    (typeof value.next === 'string' || value.next === null) &&
    (typeof value.previous === 'string' || value.previous === null) &&
    Array.isArray(value.results) &&
    value.results.every(isWallpaper)
  );
}

function normalizeImageUrl(imageUrl: string, browserBackendUrl: string): string {
  const sourceUrl = new URL(imageUrl);
  const browserUrl = new URL(browserBackendUrl);

  if (sourceUrl.origin === browserUrl.origin) {
    return imageUrl;
  }

  return new URL(`${sourceUrl.pathname}${sourceUrl.search}`, browserUrl).toString();
}

function resolveInternalPageUrl(nextUrl: string, backendApiUrl: string): string {
  const suppliedUrl = new URL(nextUrl, backendApiUrl);
  return new URL(`${suppliedUrl.pathname}${suppliedUrl.search}`, backendApiUrl).toString();
}

export async function getWallpapers(): Promise<Wallpaper[]> {
  const backendApiUrl = process.env.BACKEND_API_URL;
  const browserBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendApiUrl || !browserBackendUrl) {
    throw new Error(
      'BACKEND_API_URL and NEXT_PUBLIC_BACKEND_URL must be configured.',
    );
  }

  const wallpapers: Wallpaper[] = [];
  const visitedPages = new Set<string>();
  let pageUrl: string | null = new URL(
    '/api/wallpapers/',
    backendApiUrl,
  ).toString();

  while (pageUrl !== null) {
    if (visitedPages.has(pageUrl)) {
      throw new Error('Wallpaper API pagination returned a repeated page URL.');
    }
    visitedPages.add(pageUrl);

    const response = await fetch(pageUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Wallpaper API request failed with status ${response.status}.`);
    }

    const payload: unknown = await response.json();
    if (!isPaginatedWallpaperResponse(payload)) {
      throw new Error('Wallpaper API returned an invalid paginated response.');
    }

    wallpapers.push(
      ...payload.results.map((wallpaper) => ({
        ...wallpaper,
        imageUrl: normalizeImageUrl(wallpaper.imageUrl, browserBackendUrl),
      })),
    );
    pageUrl = payload.next
      ? resolveInternalPageUrl(payload.next, backendApiUrl)
      : null;
  }

  return wallpapers;
}
