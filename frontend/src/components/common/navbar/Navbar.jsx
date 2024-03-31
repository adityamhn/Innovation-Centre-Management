"use client";

import React from 'react'
import styles from "@/styles/components/Navbar.module.scss"
import { Avatar, Col, Dropdown, Image, Row, Space, message } from 'antd'
import PrimaryButton from '../PrimaryButton'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { showConfirm } from '../ConfirmModal';
import { useMutation } from 'react-query';
import { logoutUser } from '@/services/auth.service';
import { logout } from '@/store/user.slice';

const Navbar = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    const { user, isLoggedIn } = useSelector(state => state.user)

    const logoutMutation = useMutation(logoutUser, {
        onSuccess: () => {
            dispatch(logout())
            messageApi.success("Logged out successfully! Redirecting...", 4, () => {
            router.push("/login")
            });
        }
    })

    const handleLogout = () => {
        showConfirm({
            title: `Are you sure you want to logout?`,
            okText: `Logout`,
            onOk: async () => {
                await logoutMutation.mutateAsync()
            },
        })
    }


    const items = [
        {
            key: '1',
            label: 'My Profile'
        },
        {
            key: '4',
            danger: true,
            label: <div onClick={handleLogout}>
                Logout
            </div>,
        },
    ];


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
        <>{contextHolder}
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

                {isLoggedIn && user ? (
                    <Dropdown placement='bottom' menu={{ items }} trigger={["click"]}>
                        <Avatar className={styles.loginAvatar} size={36}>{user.name[0]}</Avatar>
                    </Dropdown>
                ) : (
                    <Link href="/login">
                        <PrimaryButton size="small" className={styles.loginButton}>Login</PrimaryButton>
                    </Link>
                )}
            </Row>
        </Row>
        </>

    )
}

export default Navbar