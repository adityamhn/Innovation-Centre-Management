import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";

const StartupsLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
        <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Startups at MIT Innovation centre</h1>
          <p className={styles.layoutDesc}>
          The Innovation Centre at Manipal Academy of Higher Education is a hub for innovation, providing a platform for students, researchers, and entrepreneurs to bring their ideas to life. With cutting-edge facilities, seed funding support, incubation support, and mentorship, the university makes it easier for individuals to turn their innovative visions into reality.
          </p>
        </div>
        {children}
      </div>
    </>
  );
};

export default StartupsLayout;
