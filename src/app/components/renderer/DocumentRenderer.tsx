import { PPPage, PPSection } from "notebook/types"
import SectionRenderer from "./SectionRenderer";
import React from "react";
import SectionContents from "./components/SectionContents";

interface RendererProps {
  page: PPPage;
  toc: SectionContents;
}

const Renderer: React.FC<RendererProps> = ({
  page,
  toc
}) => (
  <section className='nbsection'>
    {
      page.cells.map((section, index) => (
        <SectionRenderer key={index} page={page} section={section} tocContext={toc} />
      ))
    }
    <div
      dangerouslySetInnerHTML={{
        __html: page.additionalRawHtml
      }}
      className='additional-raw-html-injectable'
    />
  </section>
)

interface DocumentRendererProps {
  page: PPPage;
}

const DocumentRenderer: React.FC<DocumentRendererProps> = ({ page }) => {
  const toc: SectionContents = {
    items: [],
  };

  const renderedSections = Renderer({ page, toc });
  return renderedSections;
};

export default DocumentRenderer;
