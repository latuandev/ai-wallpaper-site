import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Header from '../../../components/Header';
import WallpaperCard from '../../../components/WallpaperCard';
import type { Wallpaper } from '../../../data/wallpapers';
import {
  getWallpaperBySlug,
  getWallpaperDownloadUrl,
  getWallpapers,
} from '../../../lib/wallpapers';

interface WallpaperDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(value));
}

function formatOrientation(orientation: Wallpaper['orientation']): string {
  return `${orientation.charAt(0).toUpperCase()}${orientation.slice(1)}`;
}

function selectMoreWallpapers(
  wallpapers: Wallpaper[],
  currentWallpaper: Wallpaper,
): Wallpaper[] {
  const candidates = wallpapers.filter(
    (wallpaper) => wallpaper.slug !== currentWallpaper.slug,
  );
  const sameCategory = candidates.filter(
    (wallpaper) => wallpaper.category === currentWallpaper.category,
  );
  const otherCategories = candidates.filter(
    (wallpaper) => wallpaper.category !== currentWallpaper.category,
  );

  return [...sameCategory, ...otherCategories].slice(0, 6);
}

export async function generateMetadata({
  params,
}: WallpaperDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const wallpaper = await getWallpaperBySlug(slug);
    if (!wallpaper) {
      return { title: 'Wallpaper Not Found' };
    }

    return {
      title: `${wallpaper.title} - ${wallpaper.quality} Wallpaper`,
      description:
        wallpaper.description ||
        `${wallpaper.title} ${wallpaper.quality} wallpaper at ${wallpaper.width} × ${wallpaper.height}.`,
    };
  } catch (error) {
    console.error('Failed to load wallpaper metadata from the backend API.', error);
    return { title: 'Wallpaper - AI Wallpaper Site' };
  }
}

export default async function WallpaperDetailPage({
  params,
}: WallpaperDetailPageProps) {
  const { slug } = await params;
  let wallpaper: Wallpaper | null;

  try {
    wallpaper = await getWallpaperBySlug(slug);
  } catch (error) {
    console.error('Failed to load wallpaper detail from the backend API.', error);
    return (
      <main className="page">
        <Header />
        <div className="detailShell shell">
          <section className="detailError">
            <h1>Wallpaper details are temporarily unavailable.</h1>
            <p>Please try again shortly.</p>
          </section>
        </div>
      </main>
    );
  }

  if (!wallpaper) {
    notFound();
  }

  let moreWallpapers: Wallpaper[] = [];
  try {
    moreWallpapers = selectMoreWallpapers(await getWallpapers(), wallpaper);
  } catch (error) {
    console.error('Failed to load more wallpapers from the backend API.', error);
  }

  const orientation = formatOrientation(wallpaper.orientation);
  const downloadUrl = getWallpaperDownloadUrl(wallpaper.slug);
  const information = [
    ['Category', wallpaper.category],
    ['Quality', wallpaper.quality],
    ['Resolution', `${wallpaper.width} × ${wallpaper.height}`],
    ['Aspect Ratio', wallpaper.aspectRatio],
    ['Orientation', orientation],
    ['Added', formatDate(wallpaper.createdAt)],
    ['Updated', formatDate(wallpaper.updatedAt)],
  ];

  return (
    <main className="page detailPage">
      <Header />
      <div className="detailShell shell">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Wallpapers</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{wallpaper.title}</span>
        </nav>

        <section
          className={`wallpaperDetail wallpaperDetail--${wallpaper.orientation}`}
          aria-labelledby="wallpaper-detail-title"
        >
          <div className={`detailPreview detailPreview--${wallpaper.orientation}`}>
            <Image
              className="detailPreviewImage"
              src={wallpaper.imageUrl}
              alt={`${wallpaper.title} wallpaper`}
              fill
              priority
              unoptimized
              sizes="(max-width: 720px) calc(100vw - 20px), (max-width: 1100px) 58vw, 68vw"
            />
          </div>

          <aside className="detailPanel">
            <span className="detailCategory">{wallpaper.category}</span>
            <h1 id="wallpaper-detail-title">{wallpaper.title}</h1>
            {wallpaper.description ? <p>{wallpaper.description}</p> : null}

            <div className="detailSummary" aria-label="Wallpaper summary">
              <div><span aria-hidden="true">◆</span><strong>{wallpaper.quality}</strong><small>Quality</small></div>
              <div><span aria-hidden="true">⌗</span><strong>{wallpaper.width} × {wallpaper.height}</strong><small>Resolution</small></div>
              <div><span aria-hidden="true">↔</span><strong>{wallpaper.aspectRatio}</strong><small>Aspect Ratio</small></div>
              <div><span aria-hidden="true">▣</span><strong>{orientation}</strong><small>Orientation</small></div>
            </div>

            <div className="detailActions">
              <a
                className="detailDownload"
                href={downloadUrl}
              >
                <span aria-hidden="true">⇩</span> Download Wallpaper
              </a>
              <button
                type="button"
                className="detailFavorite"
                aria-label={`Add ${wallpaper.title} to favorites`}
                aria-pressed="false"
              >
                ♡
              </button>
            </div>

            <dl className="detailInformation">
              {information.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {moreWallpapers.length > 0 ? (
          <section className="section detailMore" aria-labelledby="more-heading">
            <div className="sectionHeader">
              <div>
                <h2 id="more-heading">More Wallpapers</h2>
                <p>Discover more wallpapers you might like.</p>
              </div>
              <Link href="/#trending">View All →</Link>
            </div>
            <div className="row">
              {moreWallpapers.map((relatedWallpaper) => (
                <WallpaperCard
                  key={relatedWallpaper.id}
                  wallpaper={relatedWallpaper}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
