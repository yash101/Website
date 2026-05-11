import type { Metadata } from 'next';

import { default_og_image_path, site_title, site_url } from 'site-config';

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  authors?: string[];
  keywords?: string[] | string;
  openGraphImages?: unknown;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

function normalizeKeywords(keywords?: string[] | string): string[] {
  if (!keywords) {
    return [];
  }

  if (Array.isArray(keywords)) {
    return keywords.map(String).map(keyword => keyword.trim()).filter(Boolean);
  }

  return String(keywords)
    .split(',')
    .map(keyword => keyword.trim())
    .filter(Boolean);
}

function normalizeAuthors(authors?: string[]): string[] {
  return (authors || []).map(String).map(author => author.trim()).filter(Boolean);
}

function normalizeOpenGraphImages(openGraphImages: unknown, title: string) {
  const values = Array.isArray(openGraphImages) ? openGraphImages : [openGraphImages];
  const images = values
    .filter(Boolean)
    .map(value => String(value))
    .filter(Boolean)
    .map(url => ({
      url,
      alt: title,
    }));

  if (images.length > 0) {
    return images;
  }

  return [
    {
      url: default_og_image_path,
      alt: title,
    },
  ];
}

export function buildMetadata({
  title,
  description,
  path,
  authors,
  keywords,
  openGraphImages,
  type = 'website',
  publishedTime,
  modifiedTime,
}: MetadataInput): Metadata {
  const normalizedAuthors = normalizeAuthors(authors);
  const normalizedKeywords = normalizeKeywords(keywords);
  const images = normalizeOpenGraphImages(openGraphImages, title);
  const url = new URL(path, site_url).toString();

  return {
    title: {
      absolute: `${title} | ${site_title}`,
    },
    description,
    alternates: {
      canonical: path,
    },
    keywords: normalizedKeywords,
    authors: normalizedAuthors.map(name => ({ name })),
    creator: normalizedAuthors.join(', ') || undefined,
    metadataBase: new URL(site_url),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site_title,
      images,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(normalizedAuthors.length > 0 ? { authors: normalizedAuthors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(image => image.url),
    },
  };
}
