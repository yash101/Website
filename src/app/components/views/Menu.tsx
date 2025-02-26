'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { SidebarContent } from "app/util/IndexUtils";

export type NavItem = {
  href: string;
  shortTitle: string;
}

export type NavSection = {
  items: NavItem[];
  sectionHeader: string;
  sectionLink?: string;
}

interface MenuProps {
  sidebar: SidebarContent;
  topnav: React.ReactNode;
}

const navContentDefaultStyle: React.CSSProperties = {
  transition: 'all 0.3s ease-in-out',
  overflowY: 'auto',
  zIndex: 999999,
};

const Menu: React.FunctionComponent<MenuProps> = ({
  sidebar,
  topnav,
}) => {
  const [open, setOpen] = useState(false);

  const menuTriggerIcon = open ?
    <X size='32pt' /> :
    <MenuIcon size='32pt' />;

  const renderedSections = sidebar.roots.map((root, index) => {
    const {
      href,
      title,
      children
    } = root;

    const childNodes = children.map((child, cindex) => {
      return (
        <li key={'navchild-' + cindex} className='text-ellipsis block'>
          <Link href={child.href} className='link'>
            {child.title}
          </Link>
        </li>
      );
    });

    return (
      <section
        key={'section-' + index}
        className='pb-4'
      >
        <header className='text-primary-foreground text-2xl'>{
          href ?
            <Link href={href} className='link block'>
              <div className='link'>{title}</div>
            </Link> :
            <h2>{title}</h2>
        }</header>
        <nav>
          <ul>
            {childNodes}
          </ul>
        </nav>
      </section>
    );
  });

  return (
    <>
      <nav
        role="navigation"
        className={[
          open ? 'block' : 'hidden',
          'fixed',
          'overflow-auto',
          'bg-sidebar',
          'bottom-0',
          'w-[100%]',
          'p-[1em]',
          'top-[4em]',
          'xl:block',
          'xl:static',
          'xl:w-[350px]',
          'xl:mr-[1em]',
          'print:hidden',
          'border',
          'border-r-sidebar-border'
        ].join(' ')}
        id={open ? 'nav-content-open' : 'nav-content-closed'}
        style={navContentDefaultStyle}
      >
        {renderedSections}
      </nav>

      <header
        className={[
          'fixed',
          'print:static',
          'flex',
          'justify-between',
          'items-center',
          'py-2',
          'px-4',
          'h-[4em]',
          'w-full',
          'top-0',
          'border',
          'border-b-topnav-border',
          'bg-topnav'
        ].join(' ')}
        style={{
          zIndex: 1000000,
        }}
      >
        <Button
          id={open ? 'hamburger-menu-icon-open' : 'hamburger-menu-icon-closed'}
          className='xl:hidden p-0'
          size="icon"
          onClick={() => setOpen(!open)}
          role="button"
          aria-label="Toggle menu"
          variant='outline'
        >
          {menuTriggerIcon}
        </Button>
        <>
          { topnav }
        </>
      </header>
    </>
  );
}

export default Menu;
