import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";
import { cookies } from "next/headers";
import { useServerSide } from "@/services/constants";
import { checkUserLoginStatus } from "@/services/auth.service";
import Redirect from "@/components/common/constants/Redirect";

const AdminDashboardLayout = async ({ children }) => {
  const cookieStore = cookies();
  const sid = cookieStore.get("sid");

  const { data, error } = await useServerSide(() =>
    checkUserLoginStatus({ sid: sid?.value })
  );

  if ((error && !error?.isLoggedIn) || !data?.isLoggedIn || !data?.is_admin) {
    return <Redirect to="/admin/login" logout />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
        <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Admin Dashboard</h1>
        </div>
        {children}
      </div>
    </>
  );
};

export default AdminDashboardLayout;
