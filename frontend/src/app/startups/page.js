import React from "react";
import styles from "@/styles/pages/Startups.module.scss";
import { Row } from "antd";
import StartupCard from "@/components/common/startups/StartupCard";

const Startups = () => {
  return (
    <div className={styles.startupsContainer}>
        <div className={styles.startups}>
        <h2 className={styles.startupsTitle}>Ongoing projects at Innovation Centre</h2>
        <Row className={styles.list}>
            <StartupCard />
            <StartupCard />
            <StartupCard />
            <StartupCard />
            <StartupCard />
            <StartupCard />
            <StartupCard />

        </Row>
        </div>
    </div>
  );
};

export default Startups;
