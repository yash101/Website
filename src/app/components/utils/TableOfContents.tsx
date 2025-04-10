import Link from "next/link";
import { equalButNotNullOrUndefined } from "./JsUtils";
import { Separator } from "@/components/ui/separator";

interface TableOfContentsProps {
  links: {
    href: string;
    text: string;
    pageNumber?: number;
  }[];
  currentPageNumber?: number;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ links, currentPageNumber }) => (
  <div className='flex flex-row justify-items-center w-full border-2 p-4'>
    <section className='w-full'>
      <h2 className='text-xl font-bold'>{'Jump to Page 📚'}</h2>
      <Separator orientation='horizontal' />
      <ol className='pt-2 md:pl-6 list-decimal'>{
        links.map((link, index) => (
          <li className='list-none md:list-decimal' key={'item-' + index}>
            <Link className='link' href={link.href}>
              <span
                className={[
                  String(link.pageNumber) === String(currentPageNumber) && link.pageNumber !== undefined ? 'font-bold' : '',
                  'hover:underline'
                ].join(' ')}
              >
                {link.text}
              </span>
            </Link>
          </li>
        ))
      }</ol>
    </section>
  </div>
);

export default TableOfContents;
