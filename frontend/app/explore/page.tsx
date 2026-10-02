import ExploreGallery from '../../components/ExploreGallery';
import Header from '../../components/Header';
import { exploreWallpapers } from '../../data/explore-wallpapers';

export default function ExplorePage() {
  return (
    <main className="page explorePage">
      <Header activeItem="explore" />
      <div className="exploreContent shell">
        <header className="exploreIntro">
          <h1>Explore Wallpapers</h1>
          <p>Discover striking wallpapers for every screen and style.</p>
        </header>
        <ExploreGallery wallpapers={exploreWallpapers} />
      </div>
    </main>
  );
}
