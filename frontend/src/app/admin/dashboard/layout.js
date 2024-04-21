import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";
import { cookies } from "next/headers";
import { useServerSide } from "@/services/constants";
import { checkAdminLoginStatus } from "@/services/auth.service";
import Redirect from "@/components/common/constants/Redirect";
import Sidebar from "@/components/common/sidebar/Sidebar";

const AdminDashboardLayout = async ({ children }) => {
  const cookieStore = cookies();
  const sid = cookieStore.get("sid");

  const { data, error } = await useServerSide(() =>
    checkAdminLoginStatus({ sid: sid?.value })
  );

  if (
    (error && !error?.isLoggedIn) ||
    !data?.isLoggedIn ||
    !data?.user.is_admin
  ) {
    return <Redirect to="/admin/login" logout />;
  }

  return (
   <>
      <Navbar />
      <div className={styles.adminLayoutContainer}>
        <Sidebar admin />
        <div className={styles.layoutContent}>
        {children}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardLayout;
