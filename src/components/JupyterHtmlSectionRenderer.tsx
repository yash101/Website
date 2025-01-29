import parse, { DOMNode, domToReact } from "html-react-parser";
import Image from 'next/image';
import Link from 'next/link';

function replace(node: DOMNode, index: number) {
  if (node.type !== 'tag')
    return undefined;

  switch (node.name) {
    case 'img':
      let uri = node.attribs.src;
      if (uri.includes('attachment:')) {
        uri = `/assets/${uri.substring('attachment:'.length)}`;
      }

      return <Image
        key={index}
        src={uri}
        alt={node.attribs.alt || ''}
        width={Number(node.attribs.width)}
        height={Number(node.attribs.height)} />;
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
}

const JupyterHtmlSectionRenderer: React.FunctionComponent<JupyterHtmlRendererProps> = ({ html }) => {
  return parse(html, { replace });
};

export default JupyterHtmlSectionRenderer;
