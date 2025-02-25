'use client';

import dynamic from 'next/dynamic';

const CodeRunnerInternal = dynamic(() => import('./CodeRunnerInternal'), { ssr: false, });

const CodeRunner: React.FC<{ args: object }> = (props) => {
  return (
    <CodeRunnerInternal
      {...props}
    />
  );
}

export default CodeRunner;
