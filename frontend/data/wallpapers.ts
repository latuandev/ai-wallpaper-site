export interface Wallpaper {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  width: number;
  height: number;
  quality: string;
  orientation: 'landscape' | 'portrait' | 'ultrawide';
  aspectRatio: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface WallpaperSection {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  displayAspectRatio?: string;
  items: Wallpaper[];
}

export interface WallpaperSectionDefinition {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  displayAspectRatio?: string;
  wallpaperSlugs: readonly string[];
}

export const featuredWallpaperSlug = 'cinematic-mountains';

export const sectionDefinitions: WallpaperSectionDefinition[] = [
  {
    id: 'trending',
    icon: '🔥',
    title: 'Trending Now',
    subtitle: 'The most popular wallpapers this week.',
    displayAspectRatio: '16 / 9',
    wallpaperSlugs: [
      'sunset-peaks',
      'neon-city',
      'autumn-forest',
      'moonlit-lake',
      'astronaut-dreams',
      'ocean-cliff',
    ],
  },
  {
    id: 'amoled',
    icon: '🌙',
    title: 'AMOLED Picks',
    subtitle: 'Deep blacks. Vivid colors. Perfect for OLED displays.',
    displayAspectRatio: '16 / 9',
    wallpaperSlugs: [
      'neon-panther',
      'abstract-flow',
      'dark-blossom',
      'planet-rise',
      'neon-mask',
      'subway-night',
    ],
  },
  {
    id: 'anime',
    icon: '🎮',
    title: 'Anime Wallpapers',
    subtitle: 'Colorful worlds and cinematic scenes.',
    displayAspectRatio: '16 / 9',
    wallpaperSlugs: [
      'sky-journey',
      'city-twilight',
      'samurai-path',
      'cherry-blossom',
      'neon-girl',
      'dreamscape',
    ],
  },
  {
    id: 'minimal',
    icon: '🖥️',
    title: 'Minimal Desktop',
    subtitle: 'Clean, simple, and beautiful.',
    displayAspectRatio: '16 / 9',
    wallpaperSlugs: [
      'monochrome-peaks',
      'desert-dunes',
      'geometric-dark',
      'calm-ocean',
      'pastel-sky',
      'minimal-curve',
    ],
  },
];
