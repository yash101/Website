import { formatDate } from "app/util/DateUtil";
import { Calendar, User } from "lucide-react";

interface ArticlePageHeaderProps {
  title: string;
  subtitle?: string;
  authors: string | string[];
  lastPublishedOn: string | Date;
  lastModifiedOn: string | Date;
}

const ArticlePageHeader: React.FC<ArticlePageHeaderProps> = ({
  title,
  subtitle,
  authors,
  lastPublishedOn,
  lastModifiedOn,
}) => (
  <header>
    <h1 className='heading-largest'>{title}</h1>
    { subtitle && (<h2 className='text-2xl md:text-3xl'>{subtitle}</h2>) }
    <div className='mt-2'>
      {authors && <p><User className='inline-block size-[1em]' /> {authors}</p>}
      <p><Calendar className='inline-block size-[1em]' /> Published {formatDate(lastPublishedOn)}</p>
      <p><Calendar className='inline-block size-[1em]' /> Updated {formatDate(lastModifiedOn)}</p>
    </div>
  </header>
);

export default ArticlePageHeader;
