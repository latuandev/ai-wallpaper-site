import Image from 'next/image';

export default function Hero({ wallpaper }) {
  return (
    <section className="hero shell" aria-labelledby="featured-wallpaper-title">
      <Image
        className="heroImage"
        src={wallpaper.imageUrl}
        alt={`${wallpaper.title} wallpaper preview`}
        fill
        priority
        sizes="(max-width: 720px) calc(100vw - 20px), (max-width: 1440px) calc(100vw - 40px), 1440px"
      />
      <div className="heroShade" aria-hidden="true" />
      <div className="heroOverlay">
        <small>FEATURED COLLECTION</small>
        <h1 id="featured-wallpaper-title">Cinematic<br />Mountains</h1>
        <p>{wallpaper.description}</p>
        <div className="meta">{wallpaper.width} × {wallpaper.height} · {wallpaper.category} · {wallpaper.quality}</div>
        <div className="heroButtons">
          <button type="button" className="primary" aria-label={`Download ${wallpaper.title} wallpaper`}>⇩ Download</button>
          <button type="button" className="secondary" aria-label={`View details for ${wallpaper.title}`}>View Details</button>
        </div>
      </div>
    </section>
  );
}
