import Link from "next/link";
import { Grain } from "@/components/Grain";
import { site } from "@/content/sections";
import styles from "./[section]/section.module.css";

export default function NotFound() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link href="/" className={styles.home}>
          {site.title}
        </Link>
      </header>
      <main className={styles.main}>
        <div>
          <h1 className={styles.heading}>Not here</h1>
          <p className={styles.description}>
            This page doesn’t exist, or hasn’t been planted yet.
          </p>
          <Link href="/" className={styles.back}>
            ← Back to the line
          </Link>
        </div>
      </main>
      <Grain />
    </div>
  );
}
