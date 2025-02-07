import { Notebook, NotebookCell } from "app/ipynb/notebook";
import AccordionWidget from "./widgets/Accordion";
import { Suspense } from "react";
import CodeRunner from "./widgets/CodeRunner/CodeRunner";

interface JupyterRawEmbedRendererProps {
  cell: NotebookCell,
  notebook?: Notebook,
};

type RawCellType = {
  tool: string;
  props: object;
}

const JupyterRawEmbedRenderer: React.FC<JupyterRawEmbedRendererProps> = (props) => {
  let embedData: RawCellType;
  try {
    embedData = JSON.parse(props.cell.source) as RawCellType;
  } catch (e) {
    embedData = new Function(`return (${props.cell.source})`)() as RawCellType;
  }

  //  const embedData = eval(props.cell.source) as RawCellType;
  // const embedData = JSON.parse(props.cell.source) as RawCellType;

  const tools = {
    'accordion': (
      <Suspense>
        <AccordionWidget args={embedData.props} />
      </Suspense>
    ),
    'code': (
      <Suspense>
        <CodeRunner args={embedData.props} />
      </Suspense>
    ),
  }

  return tools[embedData.tool.toLowerCase()] || null;
};

export default JupyterRawEmbedRenderer;
