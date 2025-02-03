'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
import './menu.css'
import Link from "next/link";
import { site_title } from "site-config";

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
  sections: NavSection[];
}

const navContentDefaultStyle: React.CSSProperties = {
  transition: 'all 0.3s ease-in-out',
  overflowY: 'auto',
};

const Menu: React.FunctionComponent<MenuProps> = ({ sections }) => {
  const [open, setOpen] = useState(false);

  const menuTriggerIcon = open ?
    <X width="32pt" height="32pt" /> :
    <MenuIcon width="32pt" height="32pt" />;

  const renderedSections = sections.map(section => {
    const links = section.items.map(item => {
      return (
        <li key={item.href} className="my-[0.5em]">
          <Link
            href={item.href}
            className="link text-slate-700 hover:text-slate-950 hover:dark:text-slate-100 dark:text-slate-50 underline block"
            role="menuitem"
          >
            {item.shortTitle}
          </Link>
        </li>
      );
    });

    const header = <h2 className="text-4xl">{section.sectionHeader}</h2>
    const optionalLink = section.sectionLink ?
      <Link className="link" href={section.sectionLink}>{header}</Link> : header;

    return (
      <section key={section.sectionHeader} className="my-[1em]">
        {optionalLink}
        <ul className="text-lg">{links}</ul>
        <hr className="mt-[1em]" />
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
          'bg-slate-100',
          'bottom-0',
          'w-[100%]',
          'p-[1em]',
          'top-[4em]',
          'xl:block',
          'xl:static',
          'xl:w-[350px]',
          'xl:mr-[1em]',
          'print:hidden',
          'z-999',
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
          'z-1000',
          'top-0',
          'border-b',
          'bg-slate-50',
          'border-slate-600',
          'dark:bg-slate-950',
          'dark:border-slate-800',
        ].join(' ')}
      >
        <Button
          id={open ? 'hamburger-menu-icon-open' : 'hamburger-menu-icon-closed'}
          className='xl:hidden text-slate-800 dark:text-slate-100'
          size="icon"
          onClick={() => setOpen(!open)}
          role="button"
          aria-checked={open}
          aria-label="Toggle menu"
        >
          {menuTriggerIcon}
        </Button>
        <Link href='/'>
          <div className="transition-all duration-300 ease-in-out hover:underline hover:scale-105 text-4xl text-slate-800 dark:text-slate-100">{site_title}</div>
        </Link>
      </header>
    </>
  );
}

export default Menu;
