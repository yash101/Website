import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface IntraPagePaginationProps {
  href: string;
  text: string;
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pretext?: string;
}

const IntraPagePagination: React.FC<IntraPagePaginationProps> = ({
  href,
  text,
  icon,
  iconPosition = 'left',
  pretext,
}) => {
  return (
    <Link
      className={[
        iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
        'button flex gap-2 p-4 rounded-lg hover:bg-popover',
        'active:bg-popover',
        'hover:text-popover-foreground',
        'active:text-popover-foreground',
        'h-full',
        'items-center',
        'border',
        'transition-all',
        'transition-all-300',
      ].join(' ')}
      href={href}
    >
      <div
        className={[
          'w-[36px]',
          'flex',
          iconPosition !== 'right' ? 'flex-row' : 'flex-row-reverse'
        ].join(' ')}
      >
        {icon}
      </div>
      <Separator orientation='vertical' />
      <div className="flex-grow">{text}</div>
      { pretext && <Separator className='hidden md:block' orientation='vertical' /> }
      { pretext && <div className='hidden md:block'>{pretext}</div> }
    </Link>
  )
};

export default IntraPagePagination;
