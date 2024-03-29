import React from 'react'
import styles from "@/styles/pages/Startups.module.scss";
import { Image, Row, Tag } from 'antd';

const StartupCard = () => {
    return (
        <div className={styles.startupCard}>
            <div className={styles.startupCardImageContainer}>
                <Image preview={false} src={"/mahe.svg"} className={styles.startupCardImage} alt="logo" />
            </div>
            <div className={styles.startupCardDetails}>
                <Row className={styles.tags}>
                    <Tag className={styles.startupTag}>Technology</Tag>
                    <Tag className={styles.startupTag}>Technology</Tag>
                    <Tag className={styles.startupTag}>Technology</Tag>

                </Row>
                <h3 className={styles.startupCardTitle}>Startup Name</h3>
                <p className={styles.startupCardDesc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis quibusdam, mollitia aut eius deleniti quam neque </p>
            </div>
        </div>
    )
}

export default StartupCard