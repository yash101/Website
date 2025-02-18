import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { SiteArticle } from "notebook/types";
import React from "react";

interface BlogHeroLinkProps {
  article: SiteArticle;
  root: string;
}

const BlogHeroLink: React.FC<BlogHeroLinkProps> = ({ article, root }) => (
  <article>
    <header>
      <div className='flex justify-between'>
        <h1>{article.pages[0].title}</h1>
        <div>
          <span>P: { new Date(article.firstPublishedOn).toLocaleDateString() } </span>
          <span>M: { new Date(article.lastModifiedOn).toLocaleDateString() }</span>
        </div>
      </div>
      <div>
        <Accordion
          type='multiple'
          className='w-100'
        >
          { article.pages.map((page, index) => (
            <AccordionItem
              key={`item-${index}`}
              title={page.title}
              value={`item-${index}`}
            >
              <AccordionTrigger>{page.title}</AccordionTrigger>
              <AccordionContent>
                <a href={`/${root}/${article.name}/${page.pageNumber}`}>{page.subtitle}</a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </header>
  </article>
);

export default BlogHeroLink;
