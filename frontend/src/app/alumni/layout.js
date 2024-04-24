import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";

const StartupsLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
        <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Alumni</h1>
          <p className={styles.layoutDesc}>
          Welcome to the Alumni Page of the Manipal Innovation Center! We are proud to celebrate the extraordinary achievements of our alumni, who have been instrumental in establishing over 25 successful businesses across various industries. This page is dedicated to showcasing their entrepreneurial journeys, highlighting the innovative spirit and dedication that flourished within the nurturing environment of our center. Here, you will find inspiring stories, key insights, and valuable lessons from our accomplished graduates, who have not only built thriving enterprises but have also contributed significantly to economic growth and innovation. Join us in celebrating these remarkable achievements and discover how the Manipal Innovation Center continues to foster entrepreneurial excellence.
          </p>
        </div>
        {children}
      </div>
    </>
  );
};

export default StartupsLayout;
