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
      {icon}
      <Separator orientation='vertical' />
      <div>{text}</div>
      { pretext && <Separator orientation='vertical' /> }
      { pretext && <div>{pretext}</div> }
    </Link>
  )
};

export default IntraPagePagination;
