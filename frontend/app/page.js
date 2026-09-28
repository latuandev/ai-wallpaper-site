const sections = [
  {
    title: '🔥 Trending Now',
    subtitle: 'The most popular wallpapers this week.',
    items: [
      ['Sunset Peaks', '4K', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'],
      ['Neon City', 'Cyberpunk', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80'],
      ['Autumn Forest', 'Nature', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80'],
      ['Moonlit Lake', 'Night', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'],
      ['Astronaut Dreams', 'Sci-Fi', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'],
      ['Ocean Cliff', 'Nature', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80']
    ]
  },
  {
    title: '🌙 AMOLED Picks',
    subtitle: 'Deep blacks. Vivid colors. Perfect for OLED displays.',
    items: [
      ['Neon Panther', 'AMOLED', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80'],
      ['Abstract Flow', 'Abstract', 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1000&q=80'],
      ['Dark Blossom', 'AMOLED', 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80'],
      ['Planet Rise', 'Space', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80'],
      ['Neon Mask', 'Cyberpunk', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'],
      ['Subway Night', 'City', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80']
    ]
  },
  {
    title: '🎮 Anime Wallpapers',
    subtitle: 'Colorful worlds and cinematic scenes.',
    items: [
      ['Sky Journey', 'Anime', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80'],
      ['City Twilight', 'Anime', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80'],
      ['Samurai Path', 'Anime', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1000&q=80'],
      ['Cherry Blossom', 'Anime', 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1000&q=80'],
      ['Neon Girl', 'Anime', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'],
      ['Dreamscape', 'Anime', 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1000&q=80']
    ]
  },
  {
    title: '🖥️ Minimal Desktop',
    subtitle: 'Clean, simple, and beautiful.',
    items: [
      ['Monochrome Peaks', 'Minimal', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80'],
      ['Desert Dunes', 'Minimal', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80'],
      ['Geometric Dark', 'Minimal', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80'],
      ['Calm Ocean', 'Minimal', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'],
      ['Pastel Sky', 'Minimal', 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1000&q=80'],
      ['Minimal Curve', 'Minimal', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80']
    ]
  }
];

function Card({ item }) {
  const [name, tag, image] = item;
  return (
    <article className="card">
      <div className="thumb" style={{ backgroundImage: `url(${image})` }}>
        <button className="heart" aria-label="Favorite">♡</button>
      </div>
      <div className="cardText">
        <strong>{name}</strong>
        <span>3840 × 2160 · {tag}</span>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="page">
      <header className="nav shell">
        <div className="brand">AI Wallpaper Site</div>
        <nav className="desktopNav">
          <a href="#trending">Explore</a>
          <a href="#collections">Collections</a>
          <a href="#categories">Categories</a>
        </nav>
        <div className="searchWrap">
          <input placeholder="Search wallpapers, categories, or themes..." />
        </div>
        <div className="actions">
          <button>♡ Favorites</button>
          <button className="menu">☰</button>
        </div>
      </header>

      <section className="hero shell">
        <div className="heroOverlay">
          <small>FEATURED COLLECTION</small>
          <h1>Cinematic<br />Mountains</h1>
          <p>Breathtaking landscapes from around the world.<br />Let nature inspire your screen.</p>
          <div className="meta">3840 × 2160 · Nature · 4K</div>
          <div className="heroButtons">
            <button className="primary">⇩ Download</button>
            <button className="secondary">View Details</button>
          </div>
        </div>
      </section>

      <section className="content shell" id="trending">
        {sections.map((section) => (
          <div className="section" key={section.title}>
            <div className="sectionHeader">
              <div>
                <h2>{section.title}</h2>
                <p>{section.subtitle}</p>
              </div>
              <a href="#">See All →</a>
            </div>
            <div className="row">
              {section.items.map((item) => <Card key={item[0]} item={item} />)}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
