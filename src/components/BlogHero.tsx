import Link from "next/link";
import JupyterHtmlSectionRenderer from "./JupyterHtmlSectionRenderer";
import { Calendar, User } from "lucide-react";

interface BlogHeroProps {
  title: string;
  preview: string;
  href: string;
  author: string;
  published: string;
}

export default function BlogHero(props: BlogHeroProps) {
  return (
    <Link href={props.href}>
      <article className="blog-hero my-4 bg-slate-200 shadow-lg rounded-lg border-1 hover:shadow-2xl transition-all transition-[0.3s]">
        <section className="p-4 pb-0 flex flex-row">
          <div className="text-1xl text-slate-700 mr-8"><User className="inline-block w-[16pt] h-[16pt]" /> {props.author}</div>
          <div className="text-1xl text-slate-700 mr-8"><Calendar className="inline-block w-[16pt] h-[16pt]" /> {props.published}</div>
        </section>
        <h1 className="mx-4 text-4xl mb-2">{props.title}</h1>
        <section className="p-4 nbsection herosection">
          <JupyterHtmlSectionRenderer html={props.preview} notebook={null} />
        </section>
        <section className="border-t-[1px] border-t-slate-400 m-4 block">
          <p className="text-lg text-bold text-slate-700 dark:text-slate-200">Read Article 📖👉🏼</p>
        </section>
      </article>
    </Link>
  );
}
