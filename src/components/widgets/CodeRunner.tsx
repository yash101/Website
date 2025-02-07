'use client';

/*
Test code

console.log('hello world');

setInterval(() => {
    console.log(new Date().toLocaleTimeString());
}, 1000);
 */

import { useEffect, useRef, useState } from "react";
import MonacoEditor from '@monaco-editor/react';
import { Play, RefreshCw, SquareX, Trash } from "lucide-react";

type CodeRunnerProps = {
  defaultSource?: string,
  autorun?: boolean,
  header?: boolean,
}

type CodeOutput = {
  pipe: 'stdout' | 'stderr' | 'warn',
  message?: string,
}

const runtimeCode = `
try {
  console = undefined;
  delete console;
  delete window.console;
} catch (e) { }

const write = (type, ...args) => {
  self.postMessage({
    pipe: type,
    message: args.map(String).join(' '),
  });
}

const console = {
  log: (...args) => write('stdout', ...args),
  error: (...args) => write('stderr', ...args),
  warn: (...args) => write('warn', ...args),
  info: (...args) => write('stdout', ...args),
};

self.onmessage = event => {
  try {
    eval(event.data);
  } catch (err) {
    console.log(err);
  }
};

`;

const nLinesRC = runtimeCode.match(/(\r\n|\r|\n)/g).length;
const lpFpEq = (a, b) => Math.abs(a - b) < 2.0;

const CodeRunner: React.FC<{
  args?: object
}> = (props) => {
  const {
    defaultSource,
    autorun,
    header
  } = (props.args as CodeRunnerProps);
  const [ source, setSource ] = useState<string>(defaultSource || '');
  const [ outputs, setOutputs ] = useState<CodeOutput[]>([]);
  const [ editorHeight, setEditorHeight ] = useState(100);
  const workerRef = useRef<Worker | null>(null);
  const editorRef = useRef(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lines = (source || '').match(/(\r\n|\r|\n)/g)?.length || 0;
      const contentHeight = ((lines + 1) * 18) + 40
      const desiredHeight = Math.max(
        Math.min(window.innerHeight * 0.6, contentHeight),
        window.innerHeight * 0.1,
        50,
      );
      if (!lpFpEq(editorHeight, desiredHeight)) {
        setEditorHeight(desiredHeight);
      }
    }  
  }, [ source, editorHeight ]);

  const runCode = () => {
    if (typeof window === 'undefined')
      return;

    // Terminate any existing worker
    if (workerRef.current) {
      setOutputs([]);
      workerRef.current.terminate();
    }

    const worker = new Worker(URL.createObjectURL(new Blob([ runtimeCode + source ], { type: 'application/javascript', })));
    worker.onmessage = event => {
      setOutputs(previousState => {
        return [...previousState, event.data];
      });
    };

    worker.onerror = event => {
      setOutputs(previousState => {
        return [...previousState, {
          message: `Error: L${event.lineno - nLinesRC} - ${event.message}`,
          pipe: 'stderr',
        }];
      });
    }

    workerRef.current = worker;
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && autorun === true) {
      runCode();
    }
  }, [ autorun, runCode ]);

  return (
    <section className='code-runner nbsection'>
      {header !== false && (
        <section
          className='pb-4'
        >
          <h2>Try Out Some Code!</h2>
        </section>
      )}
      <section className='code-editor'>
        <MonacoEditor
          language='javascript'
          theme='vs-dark'
          value={source || ''}
          height={editorHeight}
          onChange={newCode => setSource(newCode || '')}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            editor.addAction({
              id: "run-code",
              label: "Run Code",
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
              run: runCode,
            });
          }}
          options={{
            scrollBeyondLastLine: false,
            padding: {
              top: 10, bottom: 10,
            },
          }}
        />
      </section>
      <section className='flex justify-start'>
        <button
          onClick={runCode}
          className='p-2 my-2 bg-slate-200 border-2 hover:bg-slate-300 hover:border-slate-300'
        >
          <Play />
        </button>
        <button
          onClick={() => setSource(defaultSource || '')}
          className='p-2 my-2 ml-1 bg-slate-200 border-2 hover:bg-slate-300 hover:border-slate-300'
        >
          <RefreshCw />
        </button>
        <button
          onClick={() => setSource('')}
          className='p-2 my-2 ml-1 bg-slate-200 border-2 hover:bg-slate-300 hover:border-slate-300'
        >
          <Trash />
        </button>
        <button
          onClick={() => {
            if (workerRef.current) {
              workerRef.current.terminate();
            }
          }}
          className='p-2 my-2 ml-1 bg-slate-200 border-2 hover:bg-slate-300 hover:border-slate-300'
        >
          <SquareX />
        </button>
      </section>
      <section className='border-b border-b-slate-200'><h6>Outputs</h6></section>
      <section className='code-output'>{
        outputs.map((output, index) => {
          return <p
            key={`log-${index}`}
            className={[
              'px-4',
              'border-l-2 hover:border-l-4',
              {
                stderr: 'border-l-red-500',
                stdout: 'border-l-slate-500',
                warn: 'border-l-yellow-500',
              }[output.pipe] || 'border-l-2 border-l-red-500'
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: (output.message || '') }}
            style={{ marginBottom: 0, }}
          />
        })
      }</section>
    </section>
  );
};

export default CodeRunner;
