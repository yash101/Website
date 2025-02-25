import { Separator } from "@/components/ui/separator";
import { blog_title } from "site-config";

export default async function Home() {
  return (
    <article className="px-4 py-8">
      <section>
        <h1 className="text-5xl font-bold mb-4">{blog_title}</h1>
      </section>
      <Separator />
      <section className=""><h1>Hello, world!</h1></section>
    </article>
  );
}
