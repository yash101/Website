import { NotebooksIndex } from "jupyter/JupyterTypes";

export default function BlogHome() {
  return (
    <div>Blog home</div>
  )
};

export async function getStaticPaths() {
  const fs = require('fs/promises');
  const path = require('path');
  console.log('getStaticPaths()==============')
  const file: string = await fs.readFile(path.join(process.cwd(), 'public', 'notebook.index.json'), 'utf-8');
  const index: NotebooksIndex = JSON.parse(file);

  console.log(file, index);

  const retVal = {
    paths: index.notebooks.map(slug => {
      return {
        params: {
          slug: slug.file.replace(/\.ipynb\.json$/, '').replace(/^\/notebooks\//, ''),
        },
      };
    }),
    fallback: false,
  };

  console.log(retVal);

  return retVal;
}
