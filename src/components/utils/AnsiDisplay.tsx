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
      'hover:ml-0',
      'ml-[2px]',
      'transition-all',
      'transition-[300ms]',
      'border-l-green-600',
      'px-4',
      'py-0',
      'whitespace-pre-wrap',
      'break-all',
      'text-sm',
    ],
    'stderr': [
      'border-l-2',
      'hover:border-l-4',
      'hover:pl-2',
      'hover:ml-0',
      'ml-[2px]',
      'transition-all',
      'transition-[300ms]',
      'border-l-red-600',
      'px-4',
      'py-0',
      'whitespace-pre-wrap',
      'break-all',
      'text-sm',
    ],
    'warn': [
      'border-l-2',
      'hover:border-l-4',
      'hover:pl-2',
      'hover:ml-0',
      'ml-[2px]',
      'transition-all',
      'transition-[300ms]',
      'border-l-yellow-600',
      'px-4',
      'py-0',
      'whitespace-pre-wrap',
      'break-all',
      'text-sm',
    ],
    'default': [
      'border-l border-l-2',
      'hover:border-l-4',
      'hover:pl-2',
      'hover:ml-0',
      'ml-[2px]',
      'transition-all',
      'transition-[300ms]',
      'border-l-slate-600',
      'px-4',
      'py-0',
      'whitespace-pre-wrap',
      'break-all',
      'text-sm',
    ],
  };

  if (!styles[file]) {
    file = 'default';
  }

  // the html text is sanitized and escaped in `prerender.js` when it renders the ANSI text to HTML
  return (
    <pre className={
        styles[file].join(' ')
      }
      dangerouslySetInnerHTML={{
        __html: text
      }}
      style={{ paddingTop: 0, paddingBottom: 0 }}
    />);
};
