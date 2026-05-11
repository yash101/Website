'use client';

import ErrorView from "app/components/utils/Error";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

type ExcalidrawInitialDataState = Record<string, unknown> | null;

interface ExcalidrawEmbedProps {
  diagramUrl?: string;
  diagramContent?: string;
}

const ExcalidrawEmbed: React.FC<{
  args: object,
}> = ({
  args
}) => {
  const {
    diagramUrl,
    diagramContent,
  } = args as ExcalidrawEmbedProps;

  const [ initialData, setInitialData ] = useState<ExcalidrawInitialDataState>(null);
  const [ error, setError ] = useState<Error | null>(new Error('Excalidraw does not work yet.'));

  useEffect(() => {
    if (!diagramUrl) {
      return;
    }

    fetch(diagramUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load excalidraw file: ${res.statusText}`);
        }
        return res;
      })
      .then(res => res.json())
      .then(data => setInitialData(data))
      .catch(err => {
        console.error('Failed to load excalidraw file:', err);
        setError(err);
      });
  }, [ diagramUrl ]);

  if (!diagramUrl && !diagramContent) {
    throw new Error('Either `diagramUrl` or `diagramContent` must be provided');
  }

  if (error) {
    return (<ErrorView error={error} />);
  }

  return initialData ? (
    <ErrorBoundary fallbackRender={error => (<ErrorView error={error.error as Error} />)}>
      <ErrorView error={new Error('Excalidraw does not work yet.')} />
    </ErrorBoundary>
  ) : (
    <p>Excalidraw is still loading...</p>
  );
}

export default ExcalidrawEmbed;
