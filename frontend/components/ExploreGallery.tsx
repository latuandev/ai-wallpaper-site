'use client';

import { useMemo, useState } from 'react';

import type { Wallpaper } from '../data/wallpapers';
import WallpaperCard from './WallpaperCard';

interface ExploreGalleryProps {
  wallpapers: Wallpaper[];
}

type OrientationFilter = 'all' | Wallpaper['orientation'];
type QualityFilter = 'all' | '4K' | 'HD';
type SortOption = 'latest' | 'oldest' | 'title';

const categories = ['All Categories', 'Nature', 'Space', 'Anime', 'Sci-Fi', 'Minimal', 'City', 'Animals'];
const orientations: { label: string; value: OrientationFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Ultrawide', value: 'ultrawide' },
];
const qualities: { label: string; value: QualityFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '4K', value: '4K' },
  { label: 'HD', value: 'HD' },
];
const pageSize = 6;

function matchesQuality(wallpaper: Wallpaper, quality: QualityFilter): boolean {
  if (quality === 'all') return true;
  if (quality === '4K') return wallpaper.quality === '4K';
  return wallpaper.quality !== '4K';
}

export default function ExploreGallery({ wallpapers }: ExploreGalleryProps) {
  const [category, setCategory] = useState('All Categories');
  const [orientation, setOrientation] = useState<OrientationFilter>('all');
  const [quality, setQuality] = useState<QualityFilter>('all');
  const [sort, setSort] = useState<SortOption>('latest');
  const [page, setPage] = useState(1);

  const filteredWallpapers = useMemo(() => {
    const filtered = wallpapers.filter((wallpaper) => (
      (category === 'All Categories' || wallpaper.category === category) &&
      (orientation === 'all' || wallpaper.orientation === orientation) &&
      matchesQuality(wallpaper, quality)
    ));

    return [...filtered].sort((first, second) => {
      if (sort === 'title') return first.title.localeCompare(second.title);
      const direction = sort === 'latest' ? -1 : 1;
      return direction * first.createdAt.localeCompare(second.createdAt);
    });
  }, [category, orientation, quality, sort, wallpapers]);

  const totalPages = Math.max(1, Math.ceil(filteredWallpapers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleWallpapers = filteredWallpapers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function updateFilter(action: () => void) {
    action();
    setPage(1);
  }

  return (
    <>
      <section className="filterToolbar" aria-label="Explore filters">
        <div className="filterSelect">
          <label className="srOnly" htmlFor="explore-category">Category</label>
          <select id="explore-category" value={category} onChange={(event) => updateFilter(() => setCategory(event.target.value))}>
            {categories.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        <fieldset className="filterGroup">
          <legend className="srOnly">Orientation</legend>
          {orientations.map((option) => (
            <button key={option.value} type="button" className={orientation === option.value ? 'selected' : undefined} aria-pressed={orientation === option.value} onClick={() => updateFilter(() => setOrientation(option.value))}>
              {option.label}
            </button>
          ))}
        </fieldset>

        <fieldset className="filterGroup qualityFilters">
          <legend className="srOnly">Quality</legend>
          {qualities.map((option) => (
            <button key={option.value} type="button" className={quality === option.value ? 'selected' : undefined} aria-pressed={quality === option.value} onClick={() => updateFilter(() => setQuality(option.value))}>
              {option.label}
            </button>
          ))}
        </fieldset>

        <div className="filterSelect sortSelect">
          <label className="srOnly" htmlFor="explore-sort">Sort wallpapers</label>
          <select id="explore-sort" value={sort} onChange={(event) => updateFilter(() => setSort(event.target.value as SortOption))}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </section>

      {visibleWallpapers.length > 0 ? (
        <div className="exploreGrid" aria-live="polite">
          {visibleWallpapers.map((wallpaper) => (
            <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} displayAspectRatio="4 / 3" variant="explore" />
          ))}
        </div>
      ) : (
        <div className="exploreEmpty" role="status">No wallpapers match these filters.</div>
      )}

      {filteredWallpapers.length > pageSize ? (
        <nav className="pagination" aria-label="Explore pages">
          <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>←</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button key={pageNumber} type="button" className={currentPage === pageNumber ? 'selected' : undefined} aria-label={`Page ${pageNumber}`} aria-current={currentPage === pageNumber ? 'page' : undefined} onClick={() => setPage(pageNumber)}>
              {pageNumber}
            </button>
          ))}
          <button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>→</button>
        </nav>
      ) : null}
    </>
  );
}
