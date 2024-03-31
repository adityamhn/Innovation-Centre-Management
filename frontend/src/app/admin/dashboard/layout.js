import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";

const AdminDashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
      <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Admin Dashboard</h1>
        </div>
        {children}</div>
    </>
  );
};

export default AdminDashboardLayout;
