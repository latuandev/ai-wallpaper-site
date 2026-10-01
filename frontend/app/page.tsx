import Header from '../components/Header';
import Hero from '../components/Hero';
import WallpaperSection from '../components/WallpaperSection';
import {
  featuredWallpaperSlug,
  sectionDefinitions,
  type Wallpaper,
} from '../data/wallpapers';
import { getWallpapers } from '../lib/wallpapers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let wallpapers: Wallpaper[] = [];

  try {
    wallpapers = await getWallpapers();
  } catch (error) {
    console.error('Failed to load wallpapers from the backend API.', error);
  }

  if (wallpapers.length === 0) {
    return (
      <main className="page">
        <Header />
        <div className="content shell">
          <section className="section">
            <h1>Wallpapers are temporarily unavailable.</h1>
            <p>Please try again shortly.</p>
          </section>
        </div>
      </main>
    );
  }

  const wallpapersBySlug = new Map(
    wallpapers.map((wallpaper) => [wallpaper.slug, wallpaper]),
  );
  const featuredWallpaper =
    wallpapersBySlug.get(featuredWallpaperSlug) ?? wallpapers[0];
  const sections = sectionDefinitions.map(({ wallpaperSlugs, ...section }) => ({
    ...section,
    items: wallpaperSlugs
      .map((slug) => wallpapersBySlug.get(slug))
      .filter((wallpaper): wallpaper is Wallpaper => wallpaper !== undefined),
  }));

  return (
    <main className="page">
      <Header />
      <Hero wallpaper={featuredWallpaper} />
      <div className="content shell">
        {sections.map((section) => (
          <WallpaperSection key={section.id} section={section} />
        ))}
      </div>
    </main>
  );
}
