import 'server-only';

import type { Wallpaper } from '../data/wallpapers';

interface PaginatedWallpaperResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Wallpaper[];
}

interface BackendUrls {
  api: string;
  browser: string;
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

function getBackendUrls(): BackendUrls {
  const api = process.env.BACKEND_API_URL;
  const browser = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!api || !browser) {
    throw new Error(
      'BACKEND_API_URL and NEXT_PUBLIC_BACKEND_URL must be configured.',
    );
  }

  return { api, browser };
}

export async function getWallpapers(): Promise<Wallpaper[]> {
  const backendUrls = getBackendUrls();

  const wallpapers: Wallpaper[] = [];
  const visitedPages = new Set<string>();
  let pageUrl: string | null = new URL(
    '/api/wallpapers/',
    backendUrls.api,
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
        imageUrl: normalizeImageUrl(wallpaper.imageUrl, backendUrls.browser),
      })),
    );
    pageUrl = payload.next
      ? resolveInternalPageUrl(payload.next, backendUrls.api)
      : null;
  }

  return wallpapers;
}

export async function getWallpaperBySlug(
  slug: string,
): Promise<Wallpaper | null> {
  const backendUrls = getBackendUrls();
  const detailUrl = new URL(
    `/api/wallpapers/${encodeURIComponent(slug)}/`,
    backendUrls.api,
  );
  const response = await fetch(detailUrl, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Wallpaper API request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isWallpaper(payload)) {
    throw new Error('Wallpaper API returned an invalid detail response.');
  }

  return {
    ...payload,
    imageUrl: normalizeImageUrl(payload.imageUrl, backendUrls.browser),
  };
}

export function getWallpaperDownloadUrl(slug: string): string {
  const backendUrls = getBackendUrls();
  return new URL(
    `/api/wallpapers/${encodeURIComponent(slug)}/download/`,
    backendUrls.browser,
  ).toString();
}
