interface CanonicalRendererProps {
  url?: string;
}

const CanonicalRenderer: React.FC<CanonicalRendererProps> = ({
  url
}) => {
  console.log('CanonicalRenderer', url);
  return url ? (
    <link rel='canonical' href={url} />  
  ) : <></>;
}

export default CanonicalRenderer;
