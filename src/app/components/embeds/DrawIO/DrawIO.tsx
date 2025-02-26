'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { DrawIOURL } from "site-config";

interface DrawIOProps {
  height?: string | number;
  xml?: string;
  xmlUri?: string;
}

const baseUrl = DrawIOURL;

const DrawIO: React.FC<{
  args?: object
}> = ({ args }) => {
  const {
    height,
    xml,
    xmlUri,
  } = args as DrawIOProps;
  if (!xml && !xmlUri) {
    throw new Error('Either `xml` or `xmlUri` must be provided');
  }

  const [xmlData, setXmlData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = new URLSearchParams({
    embed: '1',
    spin: '1',
    modified: 'unsavedChanges',
    proto: 'json',
    ui: 'min',
    noSaveBtn: '1',
    noExitBtn: '1',
    saveAndExit: '0',
  });

  // Handle messages from drawio
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin === baseUrl) {
      const msg = JSON.parse(event.data);
      
      // When drawio is ready, send the XML
      if (msg.event === 'init') {
        if (xmlData) {
          iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
            action: 'load',
            xml: xmlData
          }), '*');
        }
      }
    }
  }, [xmlData]);

  // Fetch XML data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(xmlUri);
        const result = await resp.text();
        setXmlData(result);
      } catch (e) {
        console.error(e);
        setError(e as Error);
      }
    };
    fetchData();
  }, [xmlUri]);

  // Setup message listener
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <iframe
      ref={iframeRef}
      src={`${baseUrl}?${params}`}
      className={[
        'w-full',
        !height ? 'h-fit' : '',
        'border',
        'bg-transparent',
      ].join(' ')}
      style={{ height: height }}
      allowFullScreen
    />
  );
}

export default DrawIO;
