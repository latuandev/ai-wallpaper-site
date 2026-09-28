import './globals.css';

export const metadata = {
  title: 'AI Wallpaper Site',
  description: 'A repository of high-quality HD/4K wallpapers, featuring an integrated AI-powered personalized wallpaper generator.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
