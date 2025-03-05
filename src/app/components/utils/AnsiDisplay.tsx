import React from "react";

interface AnsiDisplayProps {
  text: string;
  file?: string;
}

export const AnsiDisplay: React.FC<AnsiDisplayProps> = ({ text, file }) => {
  const defaultStyles = [
    'border-l-2',
    'ml-[2px]',
    'px-4',
    'py-0',
    'whitespace-pre-wrap',
    'break-all',
    'text-sm',
    'my-0',
    'transition-all-linear',
    'transition-[300ms]',
    'hover:border-l-4',
    'hover:ml-0',
];

  const styles = {
    'stdout': [
      ...defaultStyles,
      'border-l-green-600',
    ],
    'stderr': [
      ...defaultStyles,
      'border-l-red-600',
    ],
    'warn': [
      ...defaultStyles,
      'border-l-yellow-600',
    ],
    'default': [
      ...defaultStyles,
      'border-l-slate-600',
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
