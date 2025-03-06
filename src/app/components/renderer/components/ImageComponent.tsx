import Image from "next/image";
import { PPImageMetadata, PPMetadata } from "notebook/types";
import { maxImageWidth } from "site-config";

interface ImageComponentProps {
  attributes: {
    [key: string]: string | null; // attributes
  },
  metadata: Record<string, PPImageMetadata> | null;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  attributes,
  metadata,
}) => {
  let uri = attributes.src;

  const defaultDimensions = {
    width: 800,
    height: 500,
  };

  const htmlRequestedDimensions = {
    width: Number(attributes.width),
    height: Number(attributes.height),
  };

  const metadataRequestedDimensions = {
    width: null,
    height: null,
  };

  if (uri.includes('attachment:')) {
    const id = uri.substring('attachment:'.length);
    uri = `/assets/attachments/${id}`;

    if (metadata) {
      metadataRequestedDimensions.width = Number(metadata.width);
      metadataRequestedDimensions.height = Number(metadata.height);          
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

  if (finalDimensions.width > maxImageWidth) {
    finalDimensions = {
      width: maxImageWidth,
      height: finalDimensions.height * maxImageWidth / finalDimensions.width,
    };
  }

  return (
    <Image
      src={uri}
      alt={attributes.alt || ''}
      width={finalDimensions.width}
      height={finalDimensions.height}
      className={attributes.class || ''}
    />
  );

};

export default ImageComponent;
