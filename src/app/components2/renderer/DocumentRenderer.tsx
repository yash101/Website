import { PPPage, PPSection } from "notebook/types"
import SectionRenderer from "./SectionRenderer";
import EmbedRenderer from "./EmbedRenderer";

interface DocumentRendererProps {
  page: PPPage;
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({ page }) => {
  return (
    <section
      className='nbsection'
    >
      {page.cells.map((section, index) => (
        <SectionRenderer key={index} page={page} section={section} />
      ))}
    </section>
  );
};

export default DocumentRenderer;
