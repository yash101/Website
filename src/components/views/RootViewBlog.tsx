'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';
import { SIFormat } from 'notebook/types';
import { useState } from 'react';
import BlogHeroLink from './BlogHeroLink';

interface RootViewBlogProps {
  index: SIFormat;
}

enum SortBy {
  FirstPublishedOn = 'fpo',
  LastPublishedOn = 'lpo',
  LastModifiedOn = 'lmo'
}

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc'
}

const RootViewBlog: React.FC<RootViewBlogProps> = ({ index }) => {
  const [ sortBy, setSortBy ] = useState(SortBy.LastModifiedOn);
  const [ sortOrder, setSortOrder ] = useState(SortOrder.Descending);

  const title = index.config.pageTitle || '';
  const articles = index.articles
    .filter(article => article.pages.find(page => page.published))
    .sort((a, b) => {
    let ca = null;
    let cb = null;
    
    switch (sortBy) {
      case SortBy.FirstPublishedOn:
        ca = a.firstPublishedOn;
        cb = b.firstPublishedOn;
        break;
      case SortBy.LastPublishedOn:
        ca = a.lastPublishedOn;
        cb = b.lastPublishedOn;
        break;
      case SortBy.LastModifiedOn:
        ca = a.lastModifiedOn;
        cb = b.lastModifiedOn;
        break;
    }

    return (sortOrder === SortOrder.Ascending) ? ca - cb : cb - ca;
  });

  return (
    <article
      className='px-4 py-8'
    >
      <header
        className='text-5xl font-bold mb-4'
      >
        <h1>{title}</h1>
      </header>
      {
        articles.length > 1 && <>
          <hr className='my-4' />
          <section // Sorting hat
            className=''
          >
            <div role='menubar' className='flex justify-end space-x-1'>
            <Select
              defaultValue={sortBy}
              onValueChange={value => setSortBy(value as SortBy)}
            >
              <SelectTrigger className='w-[180px] hover:bg-accent'>
                <SelectValue placeholder='Sort By:' />
              </SelectTrigger>
              <SelectContent className='w-[180px]'>{
                [
                  [ SortBy.LastModifiedOn, 'Last Modified' ],
                  [ SortBy.LastPublishedOn, 'Last Page Published' ],
                  [ SortBy.FirstPublishedOn, 'First Page Published' ]
                ]
                  .map(([ value, label ]) => (
                    <SelectItem
                      value={value}
                      key={value}
                    >{label}
                    </SelectItem>
                  ))
              }</SelectContent>
            </Select>
            <Button
              variant='outline'
              onClick={() => setSortOrder(sortOrder === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending)}
            >
              {sortOrder === SortOrder.Ascending ? <ArrowUpWideNarrow /> : <ArrowDownWideNarrow />}
            </Button>
            </div>
          </section>
        </>
      }
      <section // Articles
        className='mt-4'
      >
        {
          articles.map((article, i) => (
            <BlogHeroLink
              article={article}
              root={index.base}
              key={i}
            />
          ))
        }
      </section>
      {
        // TODO: Pagination
        articles.length > 10 && <>
          <section // Pagination
            className='mt-4'
          >
            {/* TODO */null}
          </section>
        </>
      }
    </article>
  )
}

export default RootViewBlog;
