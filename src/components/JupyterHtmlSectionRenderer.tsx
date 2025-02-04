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

      const defaultDimensions = {
        width: 800,
        height: 500,
      };

      const htmlRequestedDimensions = {
        width: Number(node.attribs.width),
        height: Number(node.attribs.height),
      };

      const metadataRequestedDimensions = {
        width: null,
        height: null,
      };

      // let width = Number(node.attribs.width) || 800;
      // let height = Number(node.attribs.height) || 500;

      if (uri.includes('attachment:')) {
        const id = uri.substring('attachment:'.length);
        uri = `/assets/${id}`;
  
        const metadata: ImageMetadata | undefined =
          (notebook?.metadata?.img as Record<string, ImageMetadata>)?.[id];

        if (metadata) {
          metadataRequestedDimensions.width = Number(metadata['width']);
          metadataRequestedDimensions.height = Number(metadata['height']);          
        }
      }

      let finalDimensions = {
        width: null,
        height: null,
      };

      if (htmlRequestedDimensions.width > 0 && htmlRequestedDimensions.height > 0) {
        finalDimensions = htmlRequestedDimensions;
      } else if (metadataRequestedDimensions.width > 0 && metadataRequestedDimensions.height > 0) {
        finalDimensions = metadataRequestedDimensions;
      } else {
        finalDimensions = defaultDimensions;
      }

      // TODO: should this be a site config variable for max image width?
      if (finalDimensions.width > maxImageWidth) {
        finalDimensions = {
          width: maxImageWidth,
          height: finalDimensions.height * maxImageWidth / finalDimensions.width,
        };
      }

      return (
        <Image
          key={index}
          src={uri}
          alt={node.attribs.alt || ''}
          width={finalDimensions.width}
          height={finalDimensions.height}
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
