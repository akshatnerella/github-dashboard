import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Prefer setting NEXT_PUBLIC_SITE_URL in .env.local
 * In dev, default to http://localhost:3000 so OG/Twitter get absolute URLs.
 */
const DEFAULT_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://nerella.me'
    : 'http://localhost:3000';

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_URL).replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'Tiles — Live, shareable dashboards for everything you build',
  description: 'Turn any GitHub repo into a beautiful, shareable project showcase in seconds. No OAuth needed for public repos.',
  keywords: ['github', 'dashboard', 'project showcase', 'repository', 'analytics'],
  authors: [{ name: 'Tiles' }],
  creator: 'Tiles',

  openGraph: {
    type: 'website',
    url: '/', // resolved against metadataBase → absolute
    siteName: 'Tiles',
    title: 'Live, shareable dashboards for everything you build',
    description: 'Turn any GitHub repo into a beautiful showcase in seconds.',
    images: [
      {
        url: '/og/tiles-card.png', // served from public/og/tiles-card.png
        width: 1200,
        height: 628,
        alt: 'Tiles — Live dashboards poster',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@akshatnerella',
    creator: '@akshatnerella',
    title: 'Live, shareable dashboards for everything you build',
    description: 'Turn any GitHub repo into a beautiful showcase in seconds.',
    images: ['/og/tiles-card.png'],
  },

  themeColor: '#7c3aed',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      {/* Next will inject <head> tags generated from `metadata` automatically */}
      <body className={`${inter.className} antialiased`}>
        <div id="dashboard" className="dashboard-bg">
          {children}
        </div>
      </body>
    </html>
  );
}