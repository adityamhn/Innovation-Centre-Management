"use client";

import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import StartupsTable from "@/components/common/admin/tables/StartupsTable";
import { getAllUsers, getAllWorkspaces } from "@/services/admin.services";
import { useQuery } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";
import UsersTable from "@/components/common/admin/tables/UsersTable";
import PrimaryButton from "@/components/common/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";
import AddWorkspaceModal from "@/components/common/admin/modals/AddWorkspaceModal";
import WorkspaceTable from "@/components/common/admin/tables/WorkspaceTable";

const Workspaces = () => {
    const [createWorkspaceModalVisible, setCreateWorkspaceModalVisible] = useState(false);
  const { data, isLoading } = useQuery("all-workspaces", getAllWorkspaces);

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>Workspaces at IC</h1>
      </div>
      <Row
        align="middle"
        justify="end"
        className={styles.actionsContainer}
      >
        <Col>
        <PrimaryButton 
        onClick={() => setCreateWorkspaceModalVisible(true)}    
         size="small" 
         icon={<PlusOutlined />}>Add Workspace</PrimaryButton>
        </Col>
      </Row>
      <div className={styles.dashboardTableContainer}>
        <WorkspaceTable data={data?.workspaces} setCreateWorkspaceModalVisible={setCreateWorkspaceModalVisible} />
      </div>


      {/* Modals */}
      <AddWorkspaceModal
        visible={createWorkspaceModalVisible}
        setVisible={setCreateWorkspaceModalVisible}
        />
    </div>
  );
};

export default Workspaces;
