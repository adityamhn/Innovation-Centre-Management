"use client";

import React from "react";
import styles from "@/styles/pages/Dashboard.module.scss";
import DashboardCard from "@/components/common/dashboard/DashboardCard";
import { getUserDashboard } from "@/services/user.services";
import { useQuery } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";

const UserDashboard = () => {

  const { data, isLoading } = useQuery("user-dashboard", getUserDashboard);


  if (isLoading) {
    return <LoaderPage />;
  }


  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>Dashboard</h1>
      </div>
      <div className={styles.contents}>
        {data?.dashboard.map((item,i) => (
        <DashboardCard type={item.type} key={i} data={item} />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
