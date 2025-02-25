import DocumentRenderer from "../renderer/DocumentRenderer";
import { PageRendererInterface } from "./Renderers";

const ArticleSubpageRenderer: React.FC<PageRendererInterface> = ({ page }) => {
  return (
    <DocumentRenderer page={page} />
  );
}

export default ArticleSubpageRenderer;
