import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LogSpace — Live, shareable dashboards for everything you build',
  description: 'Turn any GitHub repo into a beautiful, public project dashboard in minutes.',
  keywords: ['github', 'dashboard', 'project showcase', 'repository', 'analytics'],
  authors: [{ name: 'LogSpace' }],
  creator: 'LogSpace',
  openGraph: {
    title: 'LogSpace — Live, shareable dashboards for everything you build',
    description: 'Turn any GitHub repo into a beautiful, public project dashboard in minutes.',
    url: 'https://logspace.dev',
    siteName: 'LogSpace',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LogSpace - Project Dashboards',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogSpace — Live, shareable dashboards for everything you build',
    description: 'Turn any GitHub repo into a beautiful, public project dashboard in minutes.',
    images: ['/og-image.png'],
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
        {children}
      </body>
    </html>
  );
}