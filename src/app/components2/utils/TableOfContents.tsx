import Link from "next/link";

interface TableOfContentsProps {
  links: {
    href: string;
    text: string;
    pageNumber?: number;
  }[];
  currentPageNumber?: number;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ links, currentPageNumber }) => {
  return (
    <div
      className='flex flex-row justify-items-center w-full border-2 p-4'
    >
      <section
        className='p-8rounded-lg w-[80%]'
      >
        <h2
          className='text-lg font-bold'
        >
          {'Table of Contents 📚'}
        </h2>
        <ol
          className='pt-2 pl-8 list-decimal'
        >
          {
            links.map(link => {
              return (
                <li
                  className={[
                    'list-decimal',
                    link.pageNumber === currentPageNumber &&
                    ![ null, undefined].includes(currentPageNumber) &&
                    'font-bold'
                  ].join(' ')}
                >
                  <Link
                    className='link'
                    href={link.href}
                  >
                    <span>{link.text}</span>
                  </Link>
                </li>
              )
            })
          }
        </ol>
      </section>
    </div>

  );
};

export default TableOfContents;
