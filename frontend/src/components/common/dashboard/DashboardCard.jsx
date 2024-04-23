import { Avatar, Card, Col, Row } from 'antd'
import React from 'react'
import styles from "@/styles/pages/Dashboard.module.scss";
import moment from 'moment';


const DashboardCard = ({ type, data }) => {
    return (
        <Card className={styles.dashboardCardContainer}>
            <Row justify="space-between"  align="middle" className={styles.dashboardCardHeader}>
                <Row align="middle" style={{gap:10}}>
                <Col>
                    <Avatar className={styles.avatar} size={32} src="/manipal.svg" />
                </Col>
                <Col>
                    <div className={styles.headerPerson}>MIT Innovation Centre</div>
                </Col>
                </Row>

                <div className={styles.type}>
                {type === "news" && "News"}
                {type === "event" && "Event"}
                {type === "opportunity" && "Opportunity"}
                </div>
            </Row>
            <div className={styles.dashboardCardContent}>
                <>
                    {type === "news" && (
                        <>
                            <div className={styles.title}>{data.title}</div>
                            <div className={styles.description}>
                                {data.content}
                            </div>
                        </>
                    )}
                </>

                <>
                    {type === "event" && (
                        <>
                            <div className={styles.title}>
                                {data.title}
                            </div>
                            <div className={styles.description}>
                                {data.description}
                            </div>
                            <div className={styles.date}>Date: <span>{moment(data.event_date).format("DD MMM YYYY")}</span></div>
                            <div className={styles.date}>Location: <span>{data.location} </span></div>

                        </>
                    )}

                    {type === "opportunity" && (
                        <>
                            <div className={styles.description}>
                                {data.opportunity_details}
                            </div>
                        </>
                    )}
                </>

            </div>
            <Row justify="space-between" className={styles.dashboardCardFooter}>
                <Col>
            
                </Col>
                <Col>
                {moment(data.posted_at).format("lll")}
                </Col>
            </Row>
        </Card>
    )
}

export default DashboardCard