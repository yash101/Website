'use client';

import React from 'react';
import Link from 'next/link';

export interface SectionContentItem {
  id: string;
  text: string;
  level: number;
}

interface SectionContents {
  items: SectionContentItem[];
}

// Not working
// TODO: make this work
const SectionContents: React.FC<SectionContents> = ({ items }) => {
  if (items.length === 0) return null;
  
  return (
    <div className="table-of-contents">
      <h2>Sections</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={`#${item.id}`}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionContents;
