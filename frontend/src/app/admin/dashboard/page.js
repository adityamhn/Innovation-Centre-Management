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
        "Total Users": data.stats?.total_users,
        "Total Approved Startups": data.stats?.total_approved_startups,
        "Total Alumni Startups": data.stats?.total_alumni_startups,
        "Total Pending Startups": data.stats?.total_pending_startups,
        "Total Invalid Startups": data.stats?.total_invalid_startups,
        "Total Workspaces": data.stats?.total_workspaces,
        "Total Pending Workspace Requests": data.stats?.total_pending_workspace_requests,
        "Total Pending Mentorship Requests": data.stats?.total_pending_mentorship_requests
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
