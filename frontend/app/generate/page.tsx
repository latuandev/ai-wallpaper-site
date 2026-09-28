import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Wallpaper | AI Wallpaper Site',
  description: 'Create a personalized wallpaper from a prompt.',
};

export default function GeneratePage() {
  return (
    <main className="generatePage">
      <div className="generateShell">
        <Link className="backLink" href="/">← Back to wallpapers</Link>
        <section className="generatorCard" aria-labelledby="generator-title">
          <div className="generatorIntro">
            <span className="eyebrow">AI WALLPAPER GENERATOR</span>
            <h1 id="generator-title">Create something made for your screen.</h1>
            <p>This is the product entry point for the future AI generation flow. The controls are intentionally UI-only for now.</p>
          </div>

          <form className="generatorForm">
            <label htmlFor="prompt">Describe your wallpaper</label>
            <textarea id="prompt" name="prompt" rows={5} placeholder="A quiet futuristic city at night, neon reflections, cinematic, deep blue tones..." />

            <div className="generatorGrid">
              <label>
                Device
                <select name="device" defaultValue="desktop">
                  <option value="desktop">Desktop · 16:9</option>
                  <option value="ultrawide">Ultrawide · 21:9</option>
                  <option value="mobile">Mobile · 9:20</option>
                </select>
              </label>
              <label>
                Quality
                <select name="quality" defaultValue="4k">
                  <option value="4k">4K</option>
                  <option value="qhd">QHD</option>
                  <option value="fhd">Full HD</option>
                </select>
              </label>
            </div>

            <button type="button" className="generateButton" aria-label="Generate wallpaper from prompt">Generate wallpaper ✨</button>
          </form>
        </section>
      </div>
    </main>
  );
}
