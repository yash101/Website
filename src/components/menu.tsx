'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
import './menu.css'
import Link from "next/link";

interface MenuProps {
  [props: string]: object | string | number;
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

const Menu: React.FunctionComponent<MenuProps> = ({}) => {
  const [open, setOpen] = useState(false);

  const menuTriggerIcon = open ?
    <X width="32pt" height="32pt" /> :
    <MenuIcon width="32pt" height="32pt" />;

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
        <div className="text-4xl">yash blog</div>
      </header>
      <nav id={open ? 'nav-content-open' : 'nav-content-closed'} style={navContentDefaultStyle}>
        <div>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about-me">About Me</Link></li>
          <li><Link href="/blog">Blog</Link></li>
        </div>
      </nav>
    </>
  );
}

export default Menu;
