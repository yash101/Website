'use client';

import { useEffect, useState } from "react";
import LocalMonacoEditor from "../CodeRunner/MonacoEditor";

export interface MonacoPreviewProps {
  defaultSource?: string;
  sourceUrl?: string;
  language?: string;
}

// Floating point comparison with a tolerance
const lpFpEq = (a, b) => Math.abs(a - b) < 2.0;

const MonacoPreview: React.FC<MonacoPreviewProps> = ({
  defaultSource,
  sourceUrl,
  language,
}) => {
  const [source, setSource] = useState<string>(defaultSource || '');
  const [editorHeight, setEditorHeight] = useState(100);

  useEffect(() => {
    const lines = (source || '').match(/(\r\n|\r|\n)/g)?.length || 0;
    const contentHeight = ((lines + 1) * 18) + 40
    const desiredHeight = Math.max(
      Math.min(window.innerHeight * 0.7, contentHeight),
      window.innerHeight * 0.1,
      50,
    );
    if (!lpFpEq(editorHeight, desiredHeight)) {
      setEditorHeight(desiredHeight);
    }
  }, [ source, editorHeight ]);

  useEffect(() => {
    if (sourceUrl) {
      fetch(sourceUrl)
        .then(response => response.text())
        .then(code => {
          setSource(code);
        })
        .catch(e => {
          console.error('Fetch error occurred: ', e);
          setSource(e.message);
        });
    }
  }, [sourceUrl]);

  return (
    <section className='code-runner codeblock not-prose'>
      <LocalMonacoEditor
        height={editorHeight}
        defaultLanguage={language || 'javascript'}
        value={source}
        onChange={(value) => setSource(value || '')}
        theme='vs-dark'
        options={{
          scrollBeyondLastLine: false,
          padding: {
            top: 10, bottom: 10,
          },
        }}
      />
    </section>
  );
};

export default MonacoPreview;
