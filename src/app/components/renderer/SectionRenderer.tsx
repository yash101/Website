import { PPPage, PPSection } from "notebook/types";
import PrerenderedHtmlRenderer from "./PrerenderedHtmlRenderer";
import CodeSectionRenderer from "./CodeSectionRenderer";
import RawRenderer from "./RawRenderer";
import SectionContents from "./components/SectionContents";

interface SectionRendererProps {
  page: PPPage;
  section: PPSection;
  tocContext?: SectionContents;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  page,
  section,
  tocContext,
}) => {
  switch (section.cell_type) {
    case 'raw':
      return <RawRenderer page={page} section={section} />;
    case 'markdown':
      return (
        <PrerenderedHtmlRenderer
          html={section.source || ''}
          notebook={page}
          tocContext={tocContext}
        />
      );
    case 'code':
      return <CodeSectionRenderer section={section} page={page} />;
  }
}

export default SectionRenderer;
