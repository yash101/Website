import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterProps {
  links: FooterLink[];
  logoSrc: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({
  links,
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 120,
  logoHeight = 40,
  companyName = 'Devyash Systems, llc.'
}) => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-slate-50">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="h-auto"
            />
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {links.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
