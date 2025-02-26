
import React from 'react';

interface PDFEmbedProps {
  args: {
    url?: string;
    width?: string;
    height?: string;
  };
}

const PDFEmbed: React.FC<PDFEmbedProps> = ({ args }) => {
  const {
    url,
    width = '100%',
    height = '600px'
  } = args;

  if (!url) {
    return null;
  }

  return (
    <object
      data={url}
      type="application/pdf"
      style={{ width, height }}
    >
      <p>Your browser does not support PDFs. <a href={url}>Download the PDF</a></p>
    </object>
  );
};

export default PDFEmbed;