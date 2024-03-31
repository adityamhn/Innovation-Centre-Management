"use client";

import React from 'react'
import styles from "@/styles/components/Sidebar.module.scss";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();

    const userItems = [
        {
            name: "Dashboard",
            path: "/dashboard"
        },
        {
            name: "Register my startup",
            path: "/dashboard/register-startup"
        },
        {
            name: "Request workspace",
            path: "/dashboard/request-workspace"
        },
        {
            name: "Request mentorship",
            path: "/dashboard/mentorship"
        },
        {
            name: "My Profile",
            path: "/dashboard/profile"
        }
    ]

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarItemsContainer}>
                {userItems.map((item, index) => {
                    return (
                        <Link href={item.path} key={index} className={`${styles.sidebarItem} ${
                            item.path === pathname ? styles.sidebarItemActive : ""
                        }`}>
                            {item.name}
                        </Link>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Sidebar