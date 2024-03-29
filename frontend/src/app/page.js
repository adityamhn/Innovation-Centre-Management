import Navbar from "@/components/common/navbar/Navbar";
import styles from "@/styles/pages/Home.module.scss";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <div className={styles.homeContent}>
          <h1 className={styles.homeTitle}>Welcome to MIT Innovation Centre</h1>
          <p className={styles.homeDesc}>
          The Innovation Centre at Manipal Academy of Higher Education is a hub for innovation, providing a platform for students, researchers, and entrepreneurs to bring their ideas to life.
          </p>
          </div>
      </div>
    </>
  );
}
