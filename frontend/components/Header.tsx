import Link from 'next/link';

interface HeaderProps {
  activeItem?: 'explore';
}

export default function Header({ activeItem }: HeaderProps) {
  return (
    <header className="nav shell">
      <Link className="brand" href="/" aria-label="AI Wallpaper Site home">AI Wallpaper Site</Link>
      <nav className="desktopNav" aria-label="Primary navigation">
        <Link
          className={activeItem === 'explore' ? 'active' : undefined}
          href="/explore"
          aria-current={activeItem === 'explore' ? 'page' : undefined}
        >
          Explore
        </Link>
        <a href="#categories">Categories</a>
        <Link className="generateLink" href="/generate">Generate ✨</Link>
      </nav>
      <div className="searchWrap">
        <label className="srOnly" htmlFor="wallpaper-search">Search wallpapers</label>
        <input id="wallpaper-search" type="search" placeholder="Search wallpapers, categories, or themes..." />
      </div>
      <div className="actions">
        <button type="button" aria-label="Open favorite wallpapers">♡ Favorites</button>
        <button type="button" className="menu" aria-label="Open navigation menu" aria-expanded="false">☰</button>
      </div>
    </header>
  );
}
