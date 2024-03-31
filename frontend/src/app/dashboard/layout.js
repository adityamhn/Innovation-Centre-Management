import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";
import { cookies } from "next/headers";
import { checkUserLoginStatus } from "@/services/auth.service";
import { useServerSide } from "@/services/constants";
import Redirect from "@/components/common/constants/Redirect";
import Sidebar from "@/components/common/sidebar/Sidebar";

const AdminDashboardLayout = async ({ children }) => {
  const cookieStore = cookies();
  const sid = cookieStore.get("sid");

  const { data, error } = await useServerSide(() =>
    checkUserLoginStatus({ sid: sid?.value })
  );

  if ((error && !error?.isLoggedIn) || !data?.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.dashboardLayoutContainer}>
        <Sidebar />
        <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Dashboard</h1>
        </div>
        {children}
      </div>
    </>
  );
};

export default AdminDashboardLayout;
