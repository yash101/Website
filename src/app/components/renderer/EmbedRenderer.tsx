import { Suspense } from "react";

import { PPPage, PPSection } from "notebook/types";

import AccordionWidget from "../embeds/Accordion";
import CodeRunner from "../embeds/CodeRunner/CodeRunner";
import DrawIO from "../embeds/DrawIO/DrawIO";
import ExcalidrawEmbed from "../embeds/Excalidraw/Excalidraw";
import ChartEmbed, { ChartEmbedProps } from "../embeds/Charts/Charts";
import MonacoPreview, { MonacoPreviewProps } from "../embeds/MonacoPreview/MonacoPreview";

type EmbedProps = {
  tool: string;
  props: object;
}

interface EmbedRendererProps {
  page: PPPage;
  section: PPSection;
}

const EmbedRenderer: React.FC<EmbedRendererProps> = (props) => {
  let embedData: EmbedProps;
  try {
    embedData = JSON.parse(props.section.source) as EmbedProps;
  } catch (e) {
    embedData = new Function(`return (${props.section.source})`)() as EmbedProps;
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
    'drawio': (
      <Suspense>
        <DrawIO args={embedData.props} />
      </Suspense>
    ),
    'excalidraw': (
      <Suspense>
        <ExcalidrawEmbed args={embedData.props} />
      </Suspense>
    ),
    'chart': (
      <Suspense>
        <ChartEmbed {...embedData.props as ChartEmbedProps} />
      </Suspense>
    ),
    'monaco-preview': (
      <Suspense>
        <MonacoPreview { ...embedData.props as MonacoPreviewProps } />
      </Suspense>
    )
  }

  return tools[embedData.tool.toLowerCase()] || <p>Unknown embed type {embedData.tool}</p>;
}

export default EmbedRenderer;
