import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";

const StartupsLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
        <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Student Community</h1>
          <p className={styles.layoutDesc}>
          Innovation Centre, MAHE, was established to commemorate the Golden Jubilee of MIT in 2007. It nurtures and encourages Innovation & Entrepreneurship culture among the students, faculty, alumni, and citizens of the region. Innovation Center helps create the pipeline for entrepreneurship; it fosters creative thinking and innovation through an open network of students, faculty members and community members. It provides the required resources to become innovators and is enriched with facilities such as Idea Café, Excelerate, Makerspace and Apple Creative Studio. Innovation centre activities are driven by the Chief Innovation Officer and his team.
          </p>
        </div>
        {children}
      </div>
    </>
  );
};

export default StartupsLayout;
