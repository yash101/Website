import React from 'react';
import { PPPage, PPSection } from 'notebook/types';
import { AnsiDisplay } from '../utils/AnsiDisplay';
import { singletonOrArrayToArray } from 'app/util/Util';

interface CodeSectionRendererProps {
  section: PPSection;
  page: PPPage;
}

function parseDisplayOutputs(cell) {
  const renderables = [];
  for (const output of cell.outputs || []) {
    if (!output.data) {
      continue;
    }

    const data = output.data;
    const altText = output.data['text/plain'] || '';
    let addedRichContent: boolean = false;

    const imageMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/webp',
    ];

    for (const mime of imageMimeTypes) {
      if (data[mime]) {
        renderables.push({
          type: 'image',
          data: `data:${mime};base64,${data[mime]}`,
          mime,
          alt: altText,
        });

        addedRichContent = true;
        break;
      }
    }

    if (data['text/html'] && !addedRichContent) {
      renderables.push({
        type: 'html',
        data: (data['text/html'] || []).join(''),
        mime: 'text/html',
        alt: altText,
      });

      addedRichContent = true;
    }

    if (!addedRichContent && altText) {
      renderables.push({
        type: 'text',
        data: altText,
      });
    }
  }

  return renderables
    .map((renderable, index) => {
      if (renderable.type === 'image') {
        return (
          <img
            className='max-w-[100%]'
            src={renderable.data}
            alt={renderable.altText || ''}
            key={`nboutput-${index}`}
          />
        );
      } else if (renderable.type === 'html') {
        return (
          <div
            key={`nboutput-${index}`}
            dangerouslySetInnerHTML={{ __html: renderable.data, }}
          />
        );
      } else if (renderable.type === 'text') {
        return (
          <div
            key={`nboutput-${index}`}
            dangerouslySetInnerHTML={{
              __html: renderable.data
            }}
          />
        );
      } else {
        return null;
      }
    })
    .filter(renderable => renderable !== null);
}

export const CodeSectionRenderer: React.FC<CodeSectionRendererProps> = ({ section: cell, page: notebook }) => {
  const consoleOutputs = [];

  (cell.outputs || [])
    .filter(output => output.output_type === 'stream')
    .filter(output => ['stdout', 'stderr'].includes(output.name))
    .forEach(output => {
      singletonOrArrayToArray(output.text).forEach(text => {
        consoleOutputs.push(<AnsiDisplay text={text} file={output.name} key={`line-${consoleOutputs.length - 1}`} />);
      });
    });

  return (
    <div className='not-prose'>
      <section className='code text-sm' dangerouslySetInnerHTML={{ __html: cell.source }}></section>
      {
        (consoleOutputs.length > 0) && (
          <section className='execute-output p-4'>
            <header className='block mb-[0.5em] text-md border-b border-b-slate-400 capitalize'>Console Logs</header>
            {consoleOutputs}
          </section>
        )
      }
      {
        parseDisplayOutputs(cell)
          .map((output, index) => (
            <section className='execute-output p-4' key={`output-${index}`}>
              <header className='block mb-[0.5em] text-md border-b border-b-slate-400 capitalize'>Display Output</header>
              <div className='flex justify-center overflow-x-auto max-h-[80vh] overflow-y-auto'>
                {output}
              </div>
            </section>
          ))
      }
    </div>
  );
};

export default CodeSectionRenderer;