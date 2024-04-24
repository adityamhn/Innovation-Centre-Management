"use client";

import { Col, Row } from "antd";
import React, { useState } from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import { getAllMentorshipRequests, getAllWorkspaceRequests } from "@/services/admin.services";
import { useQuery } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";
import UsersTable from "@/components/common/admin/tables/UsersTable";
import WorkspaceRequestsTable from "@/components/common/admin/tables/WorkspaceRequestsTable";
import WorkspaceRequestModal from "@/components/common/admin/modals/WorkspaceRequestModal";
import MentorshipRequestsTable from "@/components/common/admin/tables/MentorshipRequestsTable";
import MentorshipRequestModal from "@/components/common/admin/modals/MentorshipRequestModal";

const WorkspaceRequests = () => {
    const [requestModal, setRequestModal] = useState(false);

  const { data, isLoading } = useQuery("all-mentorship-requests", getAllMentorshipRequests);

    if (isLoading) {
    return <LoaderPage />;
    }

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>
          Mentorship Requests
        </h1>
      </div>
      <Row
        align="middle"
        justify="space-between"
        className={styles.actionsContainer}
      >
        <Col>
          {/* <Dropdown trigger={["click"]} dropdownRender={() => <AddButtonDropdown items={dropdownItems} />}>
            <div>
              <PrimaryButton size="small" icon={<PlusOutlined />}>Add Resource</PrimaryButton>
            </div>
          </Dropdown> */}
        </Col>
      </Row>
      <div className={styles.dashboardTableContainer}>
        <MentorshipRequestsTable data={data.requests} setRequestModal={setRequestModal} />
      </div>

      {/* Modals */}
      <MentorshipRequestModal
        visible={requestModal}
        setVisible={setRequestModal}
        />
    </div>
  );
};

export default WorkspaceRequests;
