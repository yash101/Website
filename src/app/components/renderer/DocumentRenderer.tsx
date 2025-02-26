import { PPPage, PPSection } from "notebook/types"
import SectionRenderer from "./SectionRenderer";
import EmbedRenderer from "./EmbedRenderer";
import React from "react";

interface DocumentRendererProps {
  page: PPPage;
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({ page }) => {
  return (
    <section className='nbsection'>
      {page.cells.map((section, index) => (
        <SectionRenderer key={index} page={page} section={section} />
      ))}
      <div
        dangerouslySetInnerHTML={{
          __html: page.additionalRawHtml
        }}
        className='additional-raw-html-injectable'
      />
    </section>
  );
};

export default DocumentRenderer;
