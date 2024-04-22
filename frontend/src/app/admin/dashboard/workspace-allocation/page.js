"use client";

import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import {
  getAllStartups,
  getAllUsers,
  getAllWorkspaceAllocations,
  getAllWorkspaces,
} from "@/services/admin.services";
import { useQuery } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";
import WorkspaceAllocationsTable from "@/components/common/admin/tables/WorkspaceAllocationsTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";
import AllocateWorkspaceModal from "@/components/common/admin/modals/AllocateWorkspaceModal";
import AllocationModal from "@/components/common/admin/modals/AllocationModal";

const WorkspaceAllocation = () => {
  const [allocateModal, setAllocateModal] = useState(false);
  const [userAllocation,setUserAllocation ] = useState(false)

  const { data: workspaces, isLoading: workspacesLoading } = useQuery(
    "all-workspaces",
    getAllWorkspaces
  );

  const { data: users, isLoading: usersLoading } = useQuery(
    "all-users",
    getAllUsers
  );

  const { data: startups, isLoading: startupsLoading } = useQuery(
    "all-startups",
    getAllStartups
  );

  const { data, isLoading } = useQuery(
    "all-allocations",
    getAllWorkspaceAllocations
  );

  if (workspacesLoading || startupsLoading || usersLoading || isLoading) {
    return <LoaderPage />;
  }

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>Workspace Allocations</h1>
      </div>
      <Row align="middle" justify="end" className={styles.actionsContainer}>
        <Col>
          <PrimaryButton
            onClick={() => setAllocateModal(true)}
            size="small"
            icon={<PlusOutlined />}
          >
            Allocate Workspace
          </PrimaryButton>
        </Col>
      </Row>
      <div className={styles.dashboardTableContainer}>
        <WorkspaceAllocationsTable data={data.allocations} setUserAllocation={setUserAllocation} />
      </div>

      {/* Modals */}
      <AllocateWorkspaceModal
        workspaces={workspaces?.workspaces.filter(
          (workspace) => workspace.available
        )}
        users={users?.users.filter((user) => !user.is_admin)}
        startups={startups?.startups}
        visible={allocateModal}
        setVisible={setAllocateModal}
      />
      <AllocationModal
        visible={userAllocation}
        setVisible={setUserAllocation}
        />
    </div>
  );
};

export default WorkspaceAllocation;
