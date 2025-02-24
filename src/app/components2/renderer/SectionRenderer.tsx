import { NotebookCell, SitePage } from "notebook/types";
import PrerenderedHtmlRenderer from "./PrerenderedHtmlRenderer";

interface SectionRendererProps {
  page: SitePage;
  section: NotebookCell;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  page,
  section
}) => {
  switch (section.cell_type) {
    case 'raw':
      return null;
    case 'markdown':
      return <PrerenderedHtmlRenderer html={section.source || ''} notebook={page} />;
  }
}

export default SectionRenderer;
