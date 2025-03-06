import { PPPage, PPSection } from "notebook/types";
import EmbedRenderer from "./EmbedRenderer";

interface RawRendererProps {
  page: PPPage;
  section: PPSection;
}

const RawRenderer: React.FC<RawRendererProps> = ({
  page,
  section
}) => (
  <section
    className='raw-embed border border-slate-950 bg-slate-100 my-[0.5em] p-4 dark:border-slate-50 dark:bg-slate-900 block'
  >
    <EmbedRenderer page={page} section={section} />
  </section>
);

export default RawRenderer;
