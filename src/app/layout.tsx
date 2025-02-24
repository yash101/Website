import fs from 'fs/promises';
import path from 'path';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "components/footer";
import Menu, { NavSection } from "components/Menu";
import { NotebookIndex } from "./ipynb/notebook";
import "./globals.css";
import { site_description, site_title } from 'site-config';
import { PUBLIC_PATH } from './util/Constants';
import { AppSidebar } from '@/components/app-sidebar';
import { getSidebarContent } from './util/IndexUtils';

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
  const sidebarContent = await getSidebarContent();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          className="flex flex-row flex-wrap xl:justify-start justify-center justify-items-center w-screen mt-[4em]"
        >
          <Menu
            sidebar={sidebarContent}
            topnav={null}
            footernav={null}
          />
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
