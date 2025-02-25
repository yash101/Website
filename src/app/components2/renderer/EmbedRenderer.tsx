import { PPPage, PPSection } from "notebook/types";

interface EmbedRendererProps {
  page: PPPage;
  section: PPSection;
}

const EmbedRenderer: React.FC<EmbedRendererProps> = () => {
  return (
    <p>Embedded content (TBD)</p>
  );
}

export default EmbedRenderer;
