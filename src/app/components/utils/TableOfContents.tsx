import Link from "next/link";
import { equalButNotNullOrUndefined } from "./JsUtils";

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
    <section className='p-8rounded-lg w-[80%]'>
      <h2 className='text-lg font-bold'>{'Table of Contents 📚'}</h2>
      <ol className='pt-2 pl-8 list-decimal'>{
        links.map((link, index) => (
          <li className='list-decimal' key={'item-' + index}>
            <Link className='link' href={link.href}>
              <span
                className={
                  String(link.pageNumber) === String(currentPageNumber) && link.pageNumber !== undefined ? 'font-bold' : ''
                }
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
