import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://yourdomain.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'Tiles — Live, shareable dashboards for everything you build',
  description: 'Turn any GitHub repo into a beautiful, shareable project showcase in seconds. No OAuth needed for public repos.',
  keywords: ['github', 'dashboard', 'project showcase', 'repository', 'analytics'],
  authors: [{ name: 'Tiles' }],
  creator: 'Tiles',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Tiles',
    title: 'Live, shareable dashboards for everything you build',
    description: 'Turn any GitHub repo into a beautiful showcase in seconds.',
    images: [
      {
        url: '/og/tiles-card.png',
        width: 1200,
        height: 628,
        alt: 'Tiles — Live dashboards poster',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/tiles-card.png'],
    site: '@akshatnerella',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#7c3aed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="dashboard" className="dashboard-bg">
          {children}
        </div>
      </body>
    </html>
  );
}