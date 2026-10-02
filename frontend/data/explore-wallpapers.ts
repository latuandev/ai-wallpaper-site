import type { Wallpaper } from './wallpapers';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

type ExploreWallpaperInput = Omit<
  Wallpaper,
  'description' | 'imageUrl' | 'updatedAt'
> & { imageFilename: string };

function createExploreWallpaper({
  imageFilename,
  ...wallpaper
}: ExploreWallpaperInput): Wallpaper {
  return {
    ...wallpaper,
    description: `${wallpaper.title} wallpaper.`,
    imageUrl: `${backendUrl}/media/wallpapers/${imageFilename}`,
    updatedAt: wallpaper.createdAt,
  };
}

export const exploreWallpapers: Wallpaper[] = [
  createExploreWallpaper({ id: 1, slug: 'cinematic-mountains', title: 'Cinematic Mountains', category: 'Nature', width: 3840, height: 2160, quality: '4K', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'cinematic-mountains.jpg', createdAt: '2026-09-24T10:00:00Z' }),
  createExploreWallpaper({ id: 2, slug: 'planet-rise', title: 'Planet Rise', category: 'Space', width: 3840, height: 2160, quality: '4K', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'planet-rise.jpg', createdAt: '2026-09-22T10:00:00Z' }),
  createExploreWallpaper({ id: 3, slug: 'sky-journey', title: 'Sky Journey', category: 'Anime', width: 3840, height: 2160, quality: '4K', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'sky-journey.jpg', createdAt: '2026-09-20T10:00:00Z' }),
  createExploreWallpaper({ id: 4, slug: 'autumn-forest', title: 'Autumn Forest', category: 'Nature', width: 2560, height: 1440, quality: 'QHD', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'autumn-forest.jpg', createdAt: '2026-09-18T10:00:00Z' }),
  createExploreWallpaper({ id: 5, slug: 'neon-city', title: 'Neon City', category: 'Sci-Fi', width: 3440, height: 1440, quality: 'UWQHD', orientation: 'ultrawide', aspectRatio: '21:9', imageFilename: 'neon-city.jpg', createdAt: '2026-09-16T10:00:00Z' }),
  createExploreWallpaper({ id: 6, slug: 'ocean-cliff', title: 'Ocean Cliff', category: 'Nature', width: 1920, height: 1080, quality: 'FHD', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'ocean-cliff.jpg', createdAt: '2026-09-14T10:00:00Z' }),
  createExploreWallpaper({ id: 7, slug: 'moonlit-lake', title: 'Moonlit Lake', category: 'Nature', width: 3840, height: 2160, quality: '4K', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'moonlit-lake.jpg', createdAt: '2026-09-12T10:00:00Z' }),
  createExploreWallpaper({ id: 8, slug: 'astronaut-dreams', title: 'Astronaut Dreams', category: 'Space', width: 2560, height: 1440, quality: 'QHD', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'astronaut-dreams.jpg', createdAt: '2026-09-10T10:00:00Z' }),
  createExploreWallpaper({ id: 9, slug: 'monochrome-peaks', title: 'Monochrome Peaks', category: 'Minimal', width: 3840, height: 2160, quality: '4K', orientation: 'landscape', aspectRatio: '16:9', imageFilename: 'monochrome-peaks.jpg', createdAt: '2026-09-08T10:00:00Z' }),
  createExploreWallpaper({ id: 10, slug: 'subway-night', title: 'Subway Night', category: 'City', width: 3440, height: 1440, quality: 'UWQHD', orientation: 'ultrawide', aspectRatio: '21:9', imageFilename: 'subway-night.jpg', createdAt: '2026-09-06T10:00:00Z' }),
  createExploreWallpaper({ id: 11, slug: 'neon-panther', title: 'Neon Panther', category: 'Animals', width: 1080, height: 2400, quality: 'HD', orientation: 'portrait', aspectRatio: '9:20', imageFilename: 'neon-panther.jpg', createdAt: '2026-09-04T10:00:00Z' }),
  createExploreWallpaper({ id: 12, slug: 'cherry-blossom', title: 'Cherry Blossom', category: 'Anime', width: 1080, height: 2400, quality: 'HD', orientation: 'portrait', aspectRatio: '9:20', imageFilename: 'cherry-blossom.jpg', createdAt: '2026-09-02T10:00:00Z' }),
];
