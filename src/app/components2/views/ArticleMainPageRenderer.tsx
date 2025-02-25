import DocumentRenderer from "../renderer/DocumentRenderer";
import { PageRendererInterface } from "./Renderers";


const ArticleMainPageRenderer: React.FC<PageRendererInterface> = ({ page }) => {
  return (
    <DocumentRenderer page={page} />
  );
}

export default ArticleMainPageRenderer;
