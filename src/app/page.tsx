import { ClaimButton } from "@/components/ClaimButton";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.wrap}>
      <div className={styles.gridBg} />
      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.tr}`} />
      <div className={`${styles.corner} ${styles.bl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      <svg className={styles.star} style={{top:"5%",left:"10%",width:22,height:22}} viewBox="0 0 24 24"><polygon points="12,2 14.5,9.5 22,9.5 16,14.5 18.5,22 12,17.5 5.5,22 8,14.5 2,9.5 9.5,9.5" fill="#00aa28" opacity="0.5"/></svg>
      <svg className={styles.star} style={{top:"8%",right:"12%",width:14,height:14}} viewBox="0 0 24 24"><polygon points="12,2 14.5,9.5 22,9.5 16,14.5 18.5,22 12,17.5 5.5,22 8,14.5 2,9.5 9.5,9.5" fill="#00aa28" opacity="0.45"/></svg>
      <svg className={styles.star} style={{top:"20%",left:"5%",width:10,height:10}} viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#00aa28" opacity="0.35"/></svg>
      <svg className={styles.star} style={{top:"30%",right:"6%",width:10,height:10}} viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#00aa28" opacity="0.3"/></svg>
      <svg className={styles.star} style={{bottom:"15%",left:"8%",width:18,height:18}} viewBox="0 0 24 24"><polygon points="12,2 14.5,9.5 22,9.5 16,14.5 18.5,22 12,17.5 5.5,22 8,14.5 2,9.5 9.5,9.5" fill="#00aa28" opacity="0.4"/></svg>
      <svg className={styles.star} style={{bottom:"10%",right:"10%",width:12,height:12}} viewBox="0 0 24 24"><polygon points="12,2 14.5,9.5 22,9.5 16,14.5 18.5,22 12,17.5 5.5,22 8,14.5 2,9.5 9.5,9.5" fill="#00aa28" opacity="0.5"/></svg>

      <h1 className={styles.title}>STARKNET MEETUP 日本</h1>

      <ClaimButton />
    </main>
  );
}
