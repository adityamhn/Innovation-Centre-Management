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
          Since 2007, we have proudly invested in 1,000+ companies addressing meaningful challenges and opportunities across six continents. The founders we back are visionary, determined, and diverse—they represent 145+ nationalities and 32% of companies have at least one woman founder.
          </p>
        </div>
        {children}
      </div>
    </>
  );
};

export default StartupsLayout;
