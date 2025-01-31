import { ImageMetadata, Notebook } from "app/ipynb/notebook";
import parse, { DOMNode, domToReact } from "html-react-parser";
import Image from 'next/image';
import Link from 'next/link';
import { maxImageWidth } from "site-config";

function replace(node: DOMNode, index: number, notebook: Notebook) {
  if (node.type !== 'tag')
    return undefined;

  switch (node.name) {
    case 'img':
      let uri = node.attribs.src;
      let width = Number(node.attribs.width) || 800;
      let height = Number(node.attribs.height) || 500;

      if (uri.includes('attachment:')) {
        const id = uri.substring('attachment:'.length);
        uri = `/assets/${id}`;
        
        const metadata: ImageMetadata | undefined =
          (notebook?.metadata?.img as Record<string, ImageMetadata>)[id];

        if (metadata) {
          width = Number(metadata['width']) || width;
          height = Number(metadata['height']) || height;          
        }
      }

      if (Number(width) > maxImageWidth) {
        height = height * maxImageWidth / width;
        width = maxImageWidth;
      }

      return (
        <Image
          key={index}
          src={uri}
          alt={node.attribs.alt || ''}
          width={Number(width)}
          height={Number(height)}
        />
      );

    case 'a':
      return (
        <Link href={node.attribs.href}>
          {domToReact(node.children as DOMNode[])}
        </Link>
      );
    default:
      return undefined;
  }
}

interface JupyterHtmlRendererProps {
  html: string;
  notebook: Notebook;
}

/**
 * Renders the html from a notebook markdown/html section as react code.
 * 
 * XSS / security note: HTML is directly rendered without cleanup. The assumption is made that the site author controls the HTML is displayed.
 * 
 * If displaying user content, ensure to sanitize the HTML first.
 * 
 * @param param0 
 * @returns 
 */
const JupyterHtmlSectionRenderer: React.FunctionComponent<JupyterHtmlRendererProps> = ({ html, notebook }) => {
  return parse(html, {
    replace: (node, index) => {
      return replace(node, index, notebook);
    }
  });
};

export default JupyterHtmlSectionRenderer;
export const dynamic = 'force-static';
