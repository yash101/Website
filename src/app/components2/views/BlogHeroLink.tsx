import { Calendar, User, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import MultiPageLinkList from "./MultiPageLinkList";
import PrerenderedHtmlRenderer from "../renderer/PrerenderedHtmlRenderer";
import { SIArticle, SIPage } from "notebook/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface BlogHeroLinkProps {
  article: SIArticle;
  root: string;
}

const BlogHeroLink: React.FC<BlogHeroLinkProps> = ({ article, root }) => {
  const pages: SIPage[] = article.pages.filter(page => page.published);
  const multiplePages: boolean = pages.length > 1;
  const authorList: Set<string> = new Set(pages.flatMap(page => page.authors));
  const lastModifiedOn: string = new Date(article.lastModifiedOn).toLocaleDateString();
  const lastPublishedOn: string = new Date(article.lastPublishedOn).toLocaleDateString();
  const firstPublishedOn: string = new Date(article.firstPublishedOn).toLocaleDateString();

  return (
    <article
      className={[].join(' ')}
    >
      <header>
        <div
          className={[
            'bg-card',
            'mb-4',
            'p-4',
            'rounded-lg',
            'shadow-lg',
            'border',
            'transition',
            'transition-all-300',
            'hover:shadow-xl',
          ].join(' ')}
        >
          <h1 className='font-bold text-2xl px-2'>{ pages[0].title }</h1>
          <section className="py-4 px-2 flex flex-row space-x-4">
            <div className="text-1xl text-slate-700">{
              Array
                .from(authorList)
                .map((author, index) => (
                  <div key={index}>
                    <User className="inline-block size-[12pt]" /> {author}
                  </div>
                ))
            }</div>
            <div className="text-1xl text-slate-700">
              <HoverCard>
                <HoverCardTrigger
                  className='hover:bg-popover hover:text-popover-foreground'
                >
                  <span><Calendar className="inline-block size-[12pt]" /> {lastModifiedOn}</span>
                </HoverCardTrigger>
                <HoverCardContent
                  className='bg-popover text-popover-foreground p-4'
                >{
                  [
                    ['Last Modified', lastModifiedOn],
                    ['Last Published', lastPublishedOn],
                    ['First Published', firstPublishedOn]
                  ].map(([label, date], index) => (
                    <div key={index}>
                      <span>{label}:</span> <span>{date}</span>
                    </div>
                  ))
                }</HoverCardContent>
              </HoverCard>
            </div>
          </section>
          <section
            className='p-2'
          >
            <PrerenderedHtmlRenderer
              html={article.hero}
              notebook={null}
            />
          </section>
          <Link
            href={`/${root}/${article.name}`}
          >
            <section
              className={[
                'hover:bg-popover',
                'hover:text-popover-foreground',
                'hover:underline',
                'p-2',
                'transition-all',
                'transition-all-300',
                'rounded-lg'
              ].join(' ')}
            >
              <p><LinkIcon className='inline-block' size={'12pt'} /> Read Article 📖👉🏼</p>
            </section>
          </Link>
          {
            multiplePages && (
              <MultiPageLinkList
                pages={pages}
                baseuri={`/${root}/${article.name}`}
              />
            )
          }
        </div>

      </header>
    </article>
  );
};

export default BlogHeroLink;
