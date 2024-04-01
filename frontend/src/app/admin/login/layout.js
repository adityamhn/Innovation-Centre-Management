import Navbar from "@/components/common/navbar/Navbar";
import React from "react";
import styles from "@/styles/pages/Layout.module.scss";
import { useServerSide } from "@/services/constants";
import { checkUserLoginStatus } from "@/services/auth.service";
import { cookies } from "next/headers";
import Redirect from "@/components/common/constants/Redirect";

const LoginLayout = async({ children }) => {
  const cookieStore = cookies();
  const sid = cookieStore.get("sid");

  const { data, error } = await useServerSide(() =>
    checkUserLoginStatus({ sid: sid?.value })
  );

  if (data?.isLoggedIn && data?.is_admin) {
    return <Redirect to="/admin/dashboard" update={data?.user}   />;
  }
  
  return (
    <>
      <Navbar />
      <div className={styles.layoutContainer}>
      <div className={styles.layoutContent}>
          <h1 className={styles.layoutTitle}>Admin Login</h1>
          <p className={styles.layoutDesc}>
            Welcome back! Login to your account to access the portal.
          </p>
        </div>
        {children}</div>
    </>
  );
};

export default LoginLayout;
