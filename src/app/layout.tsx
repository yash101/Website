import fs from 'fs/promises';
import path from 'path';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "components/footer";
import Menu, { NavSection } from "components/menu";
import { NotebookIndex } from "./ipynb/notebook";
import "./globals.css";
import { site_description, site_title } from 'site-config';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site_title,
  description: site_description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const indexFile = await fs.readFile(path.join(process.cwd(), 'public', 'ipynb_index.json'), 'utf8');
  const index: NotebookIndex = JSON.parse(indexFile) as NotebookIndex;
  
  const navSections: NavSection[] = [
    {
      items: index
        .notebooks
        .filter(notebook => notebook.published && new Date(notebook.published) < new Date())
        .filter(notebook => notebook.file.match(/^ipynb_pp\/pages\/.*.dnb$/))
        .map(notebook => ({
          href: `/pages/${notebook.slug}`,
          shortTitle: notebook['shortTitle'] as string || notebook.title,
        })),
      sectionHeader: 'Pages'
    },
    {
      items: index
        .notebooks
        .filter(notebook => notebook.published && new Date(notebook.published) < new Date())
        .filter(notebook => notebook.file.match(/^ipynb_pp\/blogs\/.*.dnb$/))
        .map(notebook => ({
          href: `/blog/${notebook.slug}`,
          shortTitle: notebook['shortTitle'] as string || notebook.title,
        })),
      sectionHeader: 'Blog',
      sectionLink: '/blog'
    },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          className="flex flex-row flex-wrap xl:justify-start justify-center justify-items-center w-screen mt-[4em]"
        >
          <Menu sections={navSections} />
          <div id="content-main">
            {children}
          </div>
        </div>
        <Footer links={[ {href: "/pages/about-me", label: "About Me"} ]} logoSrc="/icon.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css" />
      </body>
    </html>
  );
}
