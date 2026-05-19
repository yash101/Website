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
      <section className="nbsection">
        <p style={{marginBottom: 0}}>
          Hi, I'm yash! I'm a Systems engineer focused on infrastructure, distributed systems, runtimes and realtime decision systems. Please read more about me <Link href={"/pages/about-me"}>here</Link>.
        </p>
        <h3>Experience</h3>
        <p style={{marginBottom: 0}}>
          Currently building: <Link href={"/projects/eyre"}>Eyre - realtime dependency governance for modern supply chains</Link>.
          <br />
          Previously:
        </p>
        <ul style={{marginTop: 0}}>
          <li>Design Software @ SpaceX</li>
          <li>Corporate Card Management @ American Express</li>
          <li>Choice Hotels</li>
          <li>Tallwave (VC)</li>
        </ul>
        <p style={{marginBottom: 0}}>
          I enjoy building systems which aggressively simplify runtime execution through preprocessing, compilation, indexing and constrained execution environments.
        </p>
        <h3>Interests</h3>
        <ul style={{marginTop: 0}}>
          <li>Distributed systems</li>
          <li>Software supply chain security</li>
          <li>Runtimes & JIT</li>
          <li>Low-latency infra</li>
          <li>Robotics & manufacturing systems</li>
          <li>Search, indexing and recommendation systems</li>
        </ul>
        <h3>Featured</h3>
        <ul style={{marginTop: 0}}>
          <li><Link href={"/projects/eyre"}>Eyre - realtime dependency governance for modern supply chains</Link></li>
          <li><Link href={"/blog/orbital-wrap"}>Orbital Wrap (satire, sci-fi)</Link></li>
          <li><Link href={"/blog/vectorization-for-content-recommendation"}>Content recommendation systems through vectorization</Link></li>
        </ul>
      </section>
    </article>
  );
}
