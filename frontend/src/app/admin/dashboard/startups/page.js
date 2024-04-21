"use client";

import { Col, Row } from "antd";
import React from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import StartupsTable from "@/components/common/admin/tables/StartupsTable";
import { getAllStartups } from "@/services/admin.services";
import { useQuery } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";

const Startups = () => {
  const { data, isLoading } = useQuery("all-startups", getAllStartups);

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>Startups at IC</h1>
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
        <StartupsTable data={data?.startups} />
      </div>
    </div>
  );
};

export default Startups;
