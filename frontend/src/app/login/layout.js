import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";

const LoginLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
      <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Login to MIT Innovation Centre</h1>
          <p className={styles.layoutDesc}>
            Welcome back! Login to your account to access the portal.
          </p>
        </div>
        {children}</div>
    </>
  );
};

export default LoginLayout;
