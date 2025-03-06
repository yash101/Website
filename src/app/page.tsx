import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { blog_title } from "site-config";

export default async function Home() {
  return (
    <article className="px-4 py-8">
      <section>
        <h1 className="text-5xl font-bold mb-4">{blog_title}</h1>
      </section>
      <Separator />
      <section>
        <p>Yeah, still working on this :)</p>
        <p>Until later, feel free to read <Link href='/for-dummies/search-engines' className='underline'>about search engines!</Link></p>
      </section>
    </article>
  );
}
