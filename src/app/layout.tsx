import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { default_og_image_path, site_description, site_title, site_url } from 'site-config';
import { getSidebarContent } from './util/IndexUtils';
import { TopNavItems } from './NavLinks';

import Menu from './components/views/Menu';
import Footer from './components/views/footer';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: site_title,
    template: `%s | ${site_title}`,
  },
  description: site_description,
  metadataBase: new URL(site_url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: site_url,
    title: site_title,
    description: site_description,
    siteName: site_title,
    images: [
      {
        url: default_og_image_path,
        alt: site_title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site_title,
    description: site_description,
    images: [default_og_image_path],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarContent = await getSidebarContent();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div
          className={[
            'flex',
            'flex-row',
            'flex-wrap',
            'xl:justify-start',
            'justify-center',
            'justify-items-center',
            'w-screen',
            'mt-[4em]'
          ].join(' ')}
        >
          <Menu sidebar={sidebarContent} topnav={<TopNavItems />}/>
          <div id="content-main">{children}</div>
        </div>
        <Footer links={[ {href: "/pages/about-me", label: "About Me"} ]} logoSrc="/icon.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css" />
      </body>
    </html>
  );
}
