'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
import './menu.css'
import Link from "next/link";
import { site_title } from "site-config";
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
  topnav: React.FC;
  footernav: React.FC;
}

const navContentDefaultStyle: React.CSSProperties = {
  transition: 'all 0.3s ease-in-out',
  overflowY: 'auto',
  zIndex: 999999,
};

const Menu: React.FunctionComponent<MenuProps> = ({
  sidebar,
  topnav,
  footernav
}) => {
  const [open, setOpen] = useState(false);

  const menuTriggerIcon = open ?
    <X width="32pt" height="32pt" /> :
    <MenuIcon width="32pt" height="32pt" />;

  const renderedSections = sidebar.roots.map((root, index) => {
    const {
      name,
      href,
      title,
      children
    } = root;

    const childNodes = children.map((child, cindex) => {
      return (
        <li
          key={'navchild-' + cindex}
          className='link text-ellipsis'
        >
          <Link
            href={child.href}
            className='link'
          >
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
        <header
          className='text-primary-foreground text-2xl'
        >{
          href ?
            <Link
              href={href}
              className='link'
            >
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
          'print:hidden'
        ].join(' ')}
        id={open ? 'nav-content-open' : 'nav-content-closed'}
        style={navContentDefaultStyle}
      >
        {renderedSections}
      </nav>

      <header
        className={[
          'fixed',
          'flex',
          'justify-between',
          'items-center',
          'p-[1em]',
          'h-[4em]',
          'w-full',
          'top-0',
          'border-b',
          'bg-topnav'
        ].join(' ')}
        style={{
          zIndex: 1000000,
        }}
      >
        <Button
          id={open ? 'hamburger-menu-icon-open' : 'hamburger-menu-icon-closed'}
          className='xl:hidden'
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
