import Link from 'next/link';
import React from 'react';

interface NavLink {
  displayName: string;
  href: string;
}

interface HeaderProps {
  links: NavLink[];
  logo: string;
}

const Header: React.FC<HeaderProps> = ({ links, logo }) => {
  return (
    <header className="flex items-center justify-between px-2 py-4 bg-white shadow-sm">
      <div className="flex items-center">
      </div>
      
      <nav className="flex items-center space-x-6">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-slate-950">{link.displayName}</Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;