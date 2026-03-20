import Link from "next/link";
import styles from "./ArcadeScreen.module.css";

type ArcadeScreenProps = {
  title: string;
  activeTab: "claim" | "inventory";
  children: React.ReactNode;
};

const stars = [
  { style: { top: "5%", left: "10%", width: 22, height: 22 }, shape: "star", opacity: 0.5 },
  { style: { top: "8%", right: "12%", width: 14, height: 14 }, shape: "star", opacity: 0.45 },
  { style: { top: "20%", left: "5%", width: 10, height: 10 }, shape: "dot", opacity: 0.35 },
  { style: { top: "30%", right: "6%", width: 10, height: 10 }, shape: "dot", opacity: 0.3 },
  { style: { bottom: "15%", left: "8%", width: 18, height: 18 }, shape: "star", opacity: 0.4 },
  { style: { bottom: "10%", right: "10%", width: 12, height: 12 }, shape: "star", opacity: 0.5 },
] as const;

export function ArcadeScreen({
  title,
  activeTab,
  children,
}: ArcadeScreenProps) {
  return (
    <main className={styles.wrap}>
      <div className={styles.gridBg} />
      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.tr}`} />
      <div className={`${styles.corner} ${styles.bl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      {stars.map((star, index) =>
        star.shape === "star" ? (
          <svg
            key={index}
            className={styles.star}
            style={star.style}
            viewBox="0 0 24 24"
          >
            <polygon
              points="12,2 14.5,9.5 22,9.5 16,14.5 18.5,22 12,17.5 5.5,22 8,14.5 2,9.5 9.5,9.5"
              fill="#00aa28"
              opacity={star.opacity}
            />
          </svg>
        ) : (
          <svg
            key={index}
            className={styles.star}
            style={star.style}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="6" fill="#00aa28" opacity={star.opacity} />
          </svg>
        ),
      )}

      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Primary">
          <Link
            href="/"
            className={`${styles.tab} ${activeTab === "claim" ? styles.activeTab : ""}`}
          >
            Claim
          </Link>
          <Link
            href="/inventory"
            className={`${styles.tab} ${activeTab === "inventory" ? styles.activeTab : ""}`}
          >
            Collectibles
          </Link>
        </nav>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.content}>{children}</div>
      </div>
    </main>
  );
}
