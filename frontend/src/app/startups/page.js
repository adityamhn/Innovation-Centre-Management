import React from "react";
import styles from "@/styles/pages/Startups.module.scss";
import { Row } from "antd";
import StartupCard from "@/components/common/startups/StartupCard";
import { getPublicStartups } from "@/services/user.services";

const Startups = async () => {
  const {startups} = await getPublicStartups();

  return (
    <div className={styles.startupsContainer}>
      <div className={styles.startups}>
        <h2 className={styles.startupsTitle}>
          Ongoing projects at Innovation Centre
        </h2>
        <Row className={styles.list}>
          {startups.map((startup) => (
            <StartupCard startup={startup} key={startup.id} />
          ))}
   
        </Row>
      </div>
    </div>
  );
};

export default Startups;
