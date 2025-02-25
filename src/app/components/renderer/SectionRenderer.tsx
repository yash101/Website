import { PPPage, PPSection } from "notebook/types";
import PrerenderedHtmlRenderer from "./PrerenderedHtmlRenderer";
import EmbedRenderer from "./EmbedRenderer";

interface SectionRendererProps {
  page: PPPage;
  section: PPSection;
}

const renderRawSection: React.FC<{
  page: PPPage;
  section: PPSection;
}> = ({
  page,
  section
}) => (
  <section
  className='raw-embed border border-slate-950 bg-slate-100 my-[0.5em] p-4 dark:border-slate-50 dark:bg-slate-900 block'
  >
    <EmbedRenderer page={page} section={section} />
  </section>
);

const SectionRenderer: React.FC<SectionRendererProps> = ({
  page,
  section
}) => {
  switch (section.cell_type) {
    case 'raw':
      return renderRawSection({ page, section });
    case 'markdown':
      return <PrerenderedHtmlRenderer html={section.source || ''} notebook={page} />;
    case 'code':
      return null;
  }
}

export default SectionRenderer;
