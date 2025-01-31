import React from "react";

interface AnsiDisplayProps {
  text: string;
  file?: string;
}

export const AnsiDisplay: React.FC<AnsiDisplayProps> = ({ text, file }) => {
  const styles = {
    'stdout': [
      'border-l-2',
      'hover:border-l-4',
      'transition-all',
      'transition-[300ms]',
      'border-l-green-600',
      'bg-green-100',
      'px-4',
    ],
    'stderr': [
      'border-l-2',
      'hover:border-l-4',
      'transition-all',
      'transition-[300ms]',
      'border-l-red-600',
      'bg-red-100',
      'px-4',
    ],
    'default': [
      'border-l border-l-2',
      'hover:border-l-4',
      'transition-all',
      'transition-[300ms]',
      'border-l-slate-600',
      'px-4',
    ],
  };

  if (!styles[file]) {
    file = 'default';
  }

  // the html text is sanitized and escaped in `prerender.js` when it renders the ANSI text to HTML
  return (<pre className={styles[file].join(' ')} dangerouslySetInnerHTML={{ __html: text }} />);
}
