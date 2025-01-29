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
}

interface MenuProps {
  sections: NavSection[];
}

const topStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  position: 'fixed',
  width: '100%',
  zIndex: 1000,
  top: 0,
  borderBottom: '1px solid rgba(0,0,0,0.1)',
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
        <li key={item.href}>
          <Link href={item.href}>{item.shortTitle}</Link>
        </li>
      );
    });

    return (
      <section key={section.sectionHeader}>
        <h2>{section.sectionHeader}</h2>
        <ul>{links}</ul>
        <Separator />
      </section>
    );
  });

  return (
    <>
      <header style={topStyle} className="bg-transparent">
        <Button
          id={open ? 'hamburger-menu-icon-open' : 'hamburger-menu-icon-closed'}
          size="icon"
          onClick={() => setOpen(!open)}
        >
          {menuTriggerIcon}
        </Button>
        <div className="text-4xl">{site_title}</div>
      </header>
      <nav
        role="navigation"
        id={open ? 'nav-content-open' : 'nav-content-closed'}
        style={navContentDefaultStyle}
      >
        {renderedSections}
      </nav>
    </>
  );
}

export default Menu;
