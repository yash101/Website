import { Calendar, User, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { SiteArticle, SitePage } from "notebook/types";
import React from "react";
import MultiPageLinkList from "./MultiPageLinkList";
import PrerenderedHtmlRendererProps from "../renderer/PrerenderedHtmlRenderer";

interface BlogHeroLinkProps {
  article: SiteArticle;
  root: string;
}

const BlogHeroLink: React.FC<BlogHeroLinkProps> = ({ article, root }) => {
  const pages: SitePage[] = article.pages.filter(page => page.published);
  const multiplePages: boolean = pages.length > 1;
  const authorList: Set<string> = new Set(pages.flatMap(page => page.authors));

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
          <section className="py-4 px-2 flex flex-row">
            <div className="text-1xl text-slate-700 mr-8">
              <User className="inline-block w-[12pt] h-[12pt]" /> {'author tbd'}
            </div>
            <div className="text-1xl text-slate-700 mr-8">
              <Calendar className="inline-block w-[12pt] h-[12pt]" /> {new Date(article.lastModifiedOn).toLocaleDateString()}
            </div>
          </section>
          <section
            className='p-2'
          >
            <PrerenderedHtmlRendererProps html={article.hero} notebook={null} />
          </section>
          <Link
            href={`/${root}/${article.name}`}
          >
            <section
              className={[
                'hover:bg-popover',
                'hover:text-popover-foreground',
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
