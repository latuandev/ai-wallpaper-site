import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Wallpaper } from '../data/wallpapers';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  displayAspectRatio?: string;
}

interface WallpaperCardStyle extends CSSProperties {
  '--wallpaper-aspect': string;
}

export default function WallpaperCard({ wallpaper, displayAspectRatio = '16 / 9' }: WallpaperCardProps) {
  const aspectStyle: WallpaperCardStyle = { '--wallpaper-aspect': displayAspectRatio };

  return (
    <article className="card" style={aspectStyle}>
      <Link
        className="cardLink"
        href={`/wallpapers/${wallpaper.slug}`}
        aria-label={`View ${wallpaper.title} wallpaper`}
      />
      <div className="thumb">
        <Image
          src={wallpaper.imageUrl}
          alt={`${wallpaper.title} ${wallpaper.category} wallpaper`}
          fill
          unoptimized
          sizes="(max-width: 420px) 62vw, (max-width: 720px) 56vw, (max-width: 1100px) 33vw, 16vw"
        />
        <button
          type="button"
          className="heart"
          aria-label={`Add ${wallpaper.title} to favorites`}
          aria-pressed="false"
        >
          ♡
        </button>
      </div>
      <div className="cardText">
        <strong>{wallpaper.title}</strong>
        <span>{wallpaper.width} × {wallpaper.height} · {wallpaper.category}</span>
      </div>
    </article>
  );
}
