"use client";

import React, { useState } from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import { useQuery } from "react-query";
import { getAdminStats } from "@/services/admin.services";
import LoaderPage from "@/components/common/Loader/LoaderPage";

const AdminDashboard = () => {
  const [stats,setStats] = useState(null);

  const { isLoading } = useQuery("admin-stats", getAdminStats,
  {
    onSuccess: (data) => {
      setStats({
        "Total Users": 521,
        "Total Approved Startups": 25,
        "Total Alumni Startups": 18,
        "Total Pending Startups": 7,
        "Total Invalid Startups": 9,
        "Total Workspaces": 16,
        "Total Pending Workspace Requests": 4,
        "Total Pending Mentorship Requests": 1
      })
    },
    refetchInterval: 5000
  }
  );

  if (isLoading || !stats) {
    return <LoaderPage />;
  }
  return (
    <>
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>Admin Statistics</h1>
        <div className={styles.statsContainer}>
          {Object.keys(stats).map((key, i) => (
             <div className={styles.stat} key={i}>
             <div className={styles.value}>
                {stats[key]}
             </div>
             <div className={styles.key}>
                {key}
             </div>
           </div>
          ))}
         


        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
