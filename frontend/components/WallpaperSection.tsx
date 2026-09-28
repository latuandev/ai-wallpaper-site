import WallpaperCard from './WallpaperCard';
import type { WallpaperSection as WallpaperSectionData } from '../data/wallpapers';

interface WallpaperSectionProps {
  section: WallpaperSectionData;
}

export default function WallpaperSection({ section }: WallpaperSectionProps) {
  const headingId = `${section.id}-heading`;
  const displayAspectRatio = section.displayAspectRatio || '16 / 9';

  return (
    <section className="section" id={section.id} aria-labelledby={headingId}>
      <div className="sectionHeader">
        <div>
          <h2 id={headingId}><span aria-hidden="true">{section.icon}</span> {section.title}</h2>
          <p>{section.subtitle}</p>
        </div>
        <a href={`#${section.id}`} aria-label={`See all ${section.title} wallpapers`}>See All →</a>
      </div>
      <div className="row">
        {section.items.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            displayAspectRatio={displayAspectRatio}
          />
        ))}
      </div>
    </section>
  );
}
