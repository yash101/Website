'use client';

import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { useState } from "react";
import './menu.css'

interface MenuProps {
}

const menuStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '250px',
  height: '100vh',
  backgroundColor: 'white',
  boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
  overflowY: 'auto',
  transform: 'translateX(-100%)',
  transition: 'transform 0.3s ease-in-out'
};

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
        <div className="text-4xl">yash's blog</div>
      </header>
      <nav id={open ? 'nav-content-open' : 'nav-content-closed'} style={navContentDefaultStyle}>
        <div>
          <li><a href="/">Home</a></li>
          <li><a href="/about-me">About Me</a></li>
          <li><a href="/blog">Blog</a></li>
        </div>
      </nav>
    </>
  );
}

export default Menu;
