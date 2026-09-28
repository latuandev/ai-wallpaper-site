import Header from '../components/Header';
import Hero from '../components/Hero';
import WallpaperSection from '../components/WallpaperSection';
import { featuredWallpaper, sections } from '../data/wallpapers';

export default function Home() {
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
