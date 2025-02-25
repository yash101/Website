import MonacoEditor, { EditorProps, loader } from '@monaco-editor/react';

// loader.config({
//   paths: {
//     vs: '/monaco/vs'
//   }
// });

const LocalMonacoEditor: React.FC<EditorProps> = (props) => {
  return (
    <MonacoEditor
      {...props}
    />
  );
};

export default LocalMonacoEditor;
