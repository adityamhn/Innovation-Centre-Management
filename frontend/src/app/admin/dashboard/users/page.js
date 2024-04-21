"use client";

import { Col, Row } from "antd";
import React from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import StartupsTable from "@/components/common/admin/tables/StartupsTable";
import { getAllUsers } from "@/services/admin.services";
import { useQuery } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";
import UsersTable from "@/components/common/admin/tables/UsersTable";

const Startups = () => {
  const { data, isLoading } = useQuery("all-users", getAllUsers);

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>Users at IC</h1>
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
        <UsersTable data={data?.users} />
      </div>
    </div>
  );
};

export default Startups;
