import { Notebook, NotebookCell } from "app/ipynb/notebook";
import AccordionWidget from "./widgets/Accordion";

interface JupyterRawEmbedRendererProps {
  cell: NotebookCell,
  notebook?: Notebook,
};

type RawCellType = {
  tool: string;
  props: object;
}

const JupyterRawEmbedRenderer: React.FC<JupyterRawEmbedRendererProps> = (props) => {
  const embedData = JSON.parse(props.cell.source) as RawCellType;

  if (embedData.tool.toLowerCase() === 'accordion') {
    return (<AccordionWidget args={embedData.props} />)
  }

  return null;
};

export default JupyterRawEmbedRenderer;
