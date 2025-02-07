import { useEffect, useState } from "react";
import MonacoEditor, { EditorProps, loader } from '@monaco-editor/react';

// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

loader.config({
  paths: {
    vs: '/monaco/vs'
  }
});

const LocalMonacoEditor: React.FC<EditorProps> = (props) => {
  return (
    <MonacoEditor
      {...props}
    />
  );
};

export default LocalMonacoEditor;
