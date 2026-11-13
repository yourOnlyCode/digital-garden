import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Grain } from "@/components/Grain";
import { sections, site } from "@/content/sections";
import styles from "./section.module.css";

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return sections.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  return section
    ? { title: section.label, description: section.description }
    : {};
}

export default async function SectionPage({ params }: Props) {
  const { section: slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  if (!section) notFound();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link href="/" className={styles.home}>
          {site.title}
        </Link>
      </header>

      <main className={styles.main}>
        <figure className={styles.figure}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.print.src} alt="" width={240} height={240} />
          <figcaption>{section.print.credit}</figcaption>
        </figure>

        <div>
          <h1 className={styles.heading}>{section.label}</h1>
          <p className={styles.description}>{section.description}</p>
          <p className={styles.empty}>Nothing here yet.</p>
          <Link href="/" className={styles.back}>
            ← Back to the line
          </Link>
        </div>
      </main>

      <Grain />
    </div>
  );
}
