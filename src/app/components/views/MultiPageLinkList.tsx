'use client';

import { SquareMinus, SquarePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SIPage } from "notebook/types";
interface MultiPageLinkListProps {
  pages: SIPage[];
  baseuri: string;
}

const MultiPageLinkList: React.FC<MultiPageLinkListProps> = ({
  pages,
  baseuri
}) => {
  const [ isOpen, setIsOpen ] = useState(false);

  return (
    <section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          'hover:bg-popover',
          'active:bg-popover',
          'hover:text-popover-foreground',
          'active:text-popover-foreground',
          'p-2',
          'transition-all',
          'transition-all-300',
          'rounded-lg',
          'w-full',
          'text-left'
        ].join(' ')}
      >
        <div className='flex flex-row justify-between'>
          <p>📖 Jump to page</p>
          { !isOpen ? <SquarePlus /> : <SquareMinus />}
        </div>
      </button>
      { isOpen && <Separator /> }
      {
        isOpen && <nav>
          <ul>{
            pages.map((page, index) => (
              <li key={'page-' + index}>
                <Link
                  href={`${baseuri}/${page.pageNumber}`}
                  className={[
                    'link',
                    'py-2',
                    'px-[2em]',
                    'block',
                    'hover:bg-popover',
                    'hover:text-popover-foreground',
                    'active:bg-popover',
                    'hover:text-popover-foreground',
                    'block',
                    'w-full',
                    'rounded-lg',
                  ].join(' ')}
                ><LinkIcon className='inline-block' size={'12pt'} /> {page.subtitle}</Link>
              </li>
            ))
          }</ul>
        </nav>
      }
    </section>
  )
};

export default MultiPageLinkList;
