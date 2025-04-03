'use client';

import { useEffect, useRef, useState } from "react";
import { Clipboard, Play, RefreshCw, SquareX, Trash } from "lucide-react";
import ConvertAnsiToHtml from 'ansi-to-html';

import LocalMonacoEditor from "./MonacoEditor";
import { AnsiDisplay } from "app/components/utils/AnsiDisplay";

type CodeRunnerProps = {
  defaultSource?: string,
  autorun?: boolean,
  header?: boolean,
  sourceUrl?: string,
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

`;

const nLinesRC = runtimeCode.match(/(\r\n|\r|\n)/g).length;
const lpFpEq = (a, b) => Math.abs(a - b) < 2.0;
const EMPTY_OUTPUT: CodeOutput = {
  pipe: 'warn',
  message: 'Click the Play button to run the code',
};

const CodeRunner: React.FC<{
  args?: object
}> = (props) => {
  const {
    defaultSource,
    autorun,
    header,
    sourceUrl,
  } = (props.args as CodeRunnerProps);
  const [ source, setSource ] = useState<string>(defaultSource || '');
  const [ outputs, setOutputs ] = useState<CodeOutput[]>([ EMPTY_OUTPUT ]);
  const [ editorHeight, setEditorHeight ] = useState(100);
  const workerRef = useRef<Worker | null>(null);
  const editorRef = useRef(null);
  const ansiToHtml = new ConvertAnsiToHtml({
    newline: true,
    escapeXML: true,
    stream: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' || !window) {
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

  useEffect(() => {
    if (sourceUrl) {
      fetch(sourceUrl)
        .then(response => response.text())
        .then(code => {
          setSource(code);
          if (autorun) {
            runCode();
          }
        })
        .catch(e => {
          console.error('Fetch error ocurred: ', e);
          setOutputs([ e.message, e.toString() ]);
        });
    }
  }, [ sourceUrl ]);


  const getOutputs = () => {
    return outputs;
  }

  const clearOutputs = () => {
    setOutputs([ EMPTY_OUTPUT ]);
  }

  const appendOutput = (output: CodeOutput) => {
    setOutputs(current => [ ...current, output ]);
  }

  const runCode = () => {
    if (typeof window === 'undefined' || !window)
      return;

    // Terminate any existing worker
    if (workerRef.current) {
      setOutputs([]);
      workerRef.current.terminate();
    }

    const w = JSON.stringify(window.location);
    const workerSource = new Blob([`
      const location = ${w};

      ${runtimeCode}

      ${source}
    `], {
      type: 'application/javascript',
    });

    const worker = new Worker(URL.createObjectURL(workerSource));
    
    worker.onmessage = event => {
      setOutputs(previousState => {
        return [...previousState, event.data];
      });
    };

    worker.onerror = event => {
      console.log(event);
      setOutputs(previousState => {
        return [...previousState, {
          message: `Error: L${event.lineno - nLinesRC} - ${event.message}`,
          pipe: 'stderr',
        }];
      });
    }

    workerRef.current = worker;
  };

  const saveFile = async () => {
    if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
      try {
        const opts = {
          types: [
            {
              description: 'JavaScript Files',
              accept: { 'text/javascript': ['.js'] },
            },
          ],
        };
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(source);
        await writable.close();
      } catch (err) {
        console.error("Save cancelled or failed:", err);
      }
    } else if (typeof window !== 'undefined') {
      const blob = new Blob([source], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'download.js';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyAll = async () => {
    navigator.clipboard.writeText(source);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && autorun === true) {
      runCode();
    }
  }, [ autorun ]);

  return (
    <section className='code-runner codeblock not-prose'>
      { header !== false && <section className='pb-4'><h2>Try Out Some Code!</h2></section> }
      <section className='code-editor'>
        <LocalMonacoEditor
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
              keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter ],
              run: () => {
                runCode();
              },
            });

            editor.addAction({
              id: 'save-file',
              label: 'Save',
              keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS ],
              run: saveFile,
            });

            editor.addAction({
              id: 'copy-all',
              label: 'Copy All',
              keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyC ],
              run: copyAll,
            });

            editor.addAction({
              id: 'nothing',
              label: 'Nothing',
              keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR ],
              run: () => null,
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
          onClick={() => { runCode(); }}
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
          onClick={copyAll}
          className='p-2 my-2 ml-1 bg-slate-200 border-2 hover:bg-slate-300 hover:border-slate-300'
        >
          <Clipboard />
        </button>
        <button
          onClick={() => setSource('')}
          className='p-2 my-2 ml-1 bg-slate-200 border-2 hover:bg-red-500 hover:border-red-500 hover:text-slate-50'
        >
          <Trash />
        </button>
        <button
          onClick={() => {
            if (workerRef.current) {
              workerRef.current.terminate();
            }
          }}
          className='p-2 my-2 ml-1 bg-slate-200 border-2 hover:bg-red-500 hover:border-red-500 hover:text-slate-50'
        >
          <SquareX />
        </button>
      </section>
      <section className='border-b border-b-slate-400 mb-2'><h6>Outputs</h6></section>
      <section className='code-output'>
        { outputs.map((output, index) => <AnsiDisplay file={output.pipe} text={ansiToHtml.toHtml(output.message)} key={`output-${index}`} />) }
      </section>
    </section>
  );
};

export default CodeRunner;
