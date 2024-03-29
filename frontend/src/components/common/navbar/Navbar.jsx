"use client";

import React from 'react'
import styles from "@/styles/components/Navbar.module.scss"
import { Col, Image, Row } from 'antd'
import PrimaryButton from '../PrimaryButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const pathname = usePathname();


    const navItems = [
        {
            name: "Startups at IC",
            path: "/startups"
        },
        {
            name: "Student Community",
            path: "/students-community"
        },
        {
            name: "Events",
            path: "/events"

        },
        {
            name: "Alumni",
            path: "/alumni"

        }
    ]


    return (
        <Row justify="space-between" align="middle" className={styles.navbarContainer}>
            <Link href="/">
            <Row align="middle" className={styles.logoContainer}>
                <Image src={"/mahe.svg"} preview={false} className={styles.mahe} alt="MAHE logo" />
                <Col className={styles.logoText}>
                    <div className={styles.logoName}>Innovation Centre</div>
                    <div className={styles.logoDesc}>MIT HUB FOR INNOVATORS & ENTREPRENEURS</div>
                </Col>
            </Row>
            </Link>
            <Row align="middle" className={styles.navItemsContainer}>
                {navItems.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <Col className={`${styles.navItem} ${pathname === item.path && styles.activeNavItem}`}>{item.name}</Col>
                    </Link>
                ))}
                <Link href="/login">
                    <PrimaryButton size="small" className={styles.loginButton}>Login</PrimaryButton>
                </Link>
            </Row>
        </Row>
    )
}

export default Navbar