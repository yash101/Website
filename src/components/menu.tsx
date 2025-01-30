'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
import './menu.css'
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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
}

const Menu: React.FunctionComponent<MenuProps> = ({ sections }) => {
  const [open, setOpen] = useState(false);

  const menuTriggerIcon = open ?
    <X width="32pt" height="32pt" /> :
    <MenuIcon width="32pt" height="32pt" />;

  const renderedSections = sections.map(section => {
    const links = section.items.map(item => {
      return (
        <li key={item.href} className="my-[0.5em]">
          <Link href={item.href} className="text-slate-700 hover:text-slate-950 hover:dark:text-slate-100 dark:text-slate-50 underline block">{item.shortTitle}</Link>
        </li>
      );
    });

    const header = <h2 className="text-4xl">{section.sectionHeader}</h2>
    const optionalLink = section.sectionLink ?
      <Link href={section.sectionLink}>{header}</Link> : header;

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
      <header
        className="fixed flex justify-between items-center p-4 w-full z-1000 top-0 border-b bg-slate-50/90 border-slate-600 dark:bg-slate-950/90 dark:border-slate-800"
      >
        <Button
          id={open ? 'hamburger-menu-icon-open' : 'hamburger-menu-icon-closed'}
          className='xl:hidden text-slate-800 dark:text-slate-100'
          size="icon"
          onClick={() => setOpen(!open)}
        >
          {menuTriggerIcon}
        </Button>
        <Link href='/'>
          <div className="text-4xl text-slate-800 dark:text-slate-100">{site_title}</div>
        </Link>
      </header>

      <nav
        role="navigation"
        className={`overflow-auto bg-slate-100 p-[1em] xl:block xl:static xl:w-[350px] xl:mr-[1em] w-[100%] fixed ${open ? 'block' : 'hidden'}`}
        id={open ? 'nav-content-open' : 'nav-content-closed'}
        style={navContentDefaultStyle}
      >
        {renderedSections}
      </nav>
    </>
  );
}

export default Menu;
