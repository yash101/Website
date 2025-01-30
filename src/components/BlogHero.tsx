import JupyterHtmlSectionRenderer from "./JupyterHtmlSectionRenderer";

interface BlogHeroProps {
  title: string;
  preview: string;
}

export default function BlogHero(props: BlogHeroProps) {
  return (
    <article>
      <h1>Hero</h1>
      <section>
        <JupyterHtmlSectionRenderer html={props.preview} notebook={null} />
      </section>
    </article>
  )
}
