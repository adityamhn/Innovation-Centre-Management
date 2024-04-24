import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";

const StartupsLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
        <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Events</h1>
          <p className={styles.layoutDesc}>
            We organize various events throughout the year to promote innovation and entrepreneurship among the students, faculty, alumni, and citizens of the region. Our events are designed to foster creative thinking and innovation through an open network of students, faculty members, and community members. We provide the required resources to become innovators and are enriched with facilities such as Idea Café, Excelerate, Makerspace, and Apple Creative Studio. Our activities are driven by the Chief Innovation Officer and his team.
          </p>
        </div>
        {children}
      </div>
    </>
  );
};

export default StartupsLayout;
