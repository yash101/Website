import Link from "next/link";
import { site_title } from "site-config";

export const TopNavItems: React.FC = async () => (
  <>
    <Link
      href='/'
      className='font-bold lg:text-4xl text-2xl'
    >{site_title}</Link>
  </>
);

export const FooterLinks: React.FC = async () => (
  <></>
);
