import React from 'react'
import styles from "@/styles/pages/Startups.module.scss";
import { Image, Row, Tag } from 'antd';
import Link from 'next/link';

const StartupCard = ({ startup }) => {
    return (
        <div className={styles.startupCard}>
            <Link href={startup?.website_url} target="_blank">
                <div className={styles.startupCardImageContainer}>
                    <Image preview={false} src={
                        startup.logo_url ? startup.logo_url : "https://via.placeholder.com/150"
                    } className={styles.startupCardImage} alt="logo" />
                </div>
            </Link>
            <div className={styles.startupCardDetails}>
                <Row className={styles.tags}>
                    {startup.industry.map((tag, i) => (
                        <Tag className={styles.startupTag} key={i}>{tag}</Tag>
                    ))}

                </Row>
                <h3 className={styles.startupCardTitle}>{startup.name}</h3>
                <p className={styles.startupCardDesc}>{startup.description}</p>
            </div>
        </div>
    )
}

export default StartupCard