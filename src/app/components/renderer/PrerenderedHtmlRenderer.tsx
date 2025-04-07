import parse, { DOMNode, domToReact, Element } from "html-react-parser";
import Link from 'next/link';
import { PPPage } from "notebook/types";
import ImageComponent from "./components/ImageComponent";
import TabsComponent from "./components/TabsComponent";
import slugify from 'slugify';
import SectionContents, { SectionContentItem } from "./components/SectionContents";

function replace(node: DOMNode, index: number, notebook: PPPage, tocItems: SectionContentItem[]) {
  if (node.type !== 'tag')
    return undefined;

  // Handle headings (h1-h6)
  if (/^h[1-6]$/.test(node.name)) {
    const level = parseInt(node.name.substring(1), 10);
    const text = domToReact(node.children as DOMNode[]) as string;
    
    // Create a slug ID for the heading
    const id = slugify(text.toString(), { lower: true, strict: true });
    
    if (Array.isArray(tocItems)) {
      // Add to TOC items
      tocItems.push({
        id,
        text: text.toString(),
        level
      });
    }

    // Return heading with ID attribute for linking
    return (
      <div id={id} className="relative group scroll-m-24 ml-8">
        <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-30 group-hover:opacity-100">
          <Link href={`#${id}`} className="text-gray-500 hover:text-gray-700 text-4xl">#</Link>
        </span>
        {domToReact([node as DOMNode])}
      </div>
    );
    
    
    // return (</div>
    //   <Link id={id} href={`#${id}`} className='scroll-m-[4em]'>
    //     { domToReact([node as DOMNode]) }
    //   </Link>
    // );
  }

  switch (node.name) {
    case 'img':
      return (
        <ImageComponent
          attributes={node.attribs}
          metadata={notebook.metadata.img || null}
        />
      );

    case 'a':
      let href = node.attribs.href;
      if (href.startsWith('attachment:')) {
        href = href.replace('attachment:', '/assets/attachments/');
      }
      return (
        <Link href={node.attribs.href}>
          {domToReact(node.children as DOMNode[])}
        </Link>
      );

    case 'div':
      if (node.attribs.class?.includes('tabs-tabs-wrapper')) {
        return (<TabsComponent node={node} />);
      }
      return undefined;

    default:
      return undefined;
  }
}

interface PrerenderedHtmlRendererProps {
  html: string;
  notebook: PPPage;
  tocContext?: SectionContents;
}

const PrerenderedHtmlRenderer: React.FunctionComponent<PrerenderedHtmlRendererProps> = ({
  html,
  notebook,
  tocContext,
}) => {
  // Parse the HTML and collect headings
  const content = parse(html, {
    replace: (node, index) => {
      return replace(node, index, notebook, tocContext?.items);
    }
  });

  return content;
};

export default PrerenderedHtmlRenderer;
export const dynamic = 'force-static';
