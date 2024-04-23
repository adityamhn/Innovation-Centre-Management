"use client";

import React from 'react'
import styles from "@/styles/components/Sidebar.module.scss";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ admin }) => {
    const pathname = usePathname();

    const userItems = [
        {
            name: "Dashboard",
            path: "/dashboard"
        },
        {
            name: "Startup",
            path: "/dashboard/startup"
        },
        {
            name: "Workspaces",
            path: "/dashboard/workspace"
        },
        {
            name: "Mentorship",
            path: "/dashboard/mentorship"
        },
        {
            name: "My Profile",
            path: "/dashboard/profile"
        }
    ]

    const adminItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard"
        },
        {
            name: "Users",
            path: "/admin/dashboard/users"
        },
        {
            name: "Startups",
            path: "/admin/dashboard/startups"
        },
        {
            name: "Workspaces",
            path: "/admin/dashboard/workspaces"
        },
        {
            name: "Workspace Requests",
            path: "/admin/dashboard/workspace-requests"
        },
        {
            name: "Workspace Allocations",
            path: "/admin/dashboard/workspace-allocation"
        },
        {
            name: "Add News",
            path: "/admin/dashboard/news"
        }
    ]

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarItemsContainer}>
                {admin ? (
                    <>
                        {adminItems.map((item, index) => {
                            return (
                                <Link href={item.path
                                } key={index} className={`${styles.sidebarItem} ${item.path === pathname ? styles.sidebarItemActive : ""
                                    }`}>
                                    {item.name}
                                </Link>
                            )
                        })
                        }
                    </>
                ) : <>
                    {userItems.map((item, index) => {
                        return (
                            <Link href={item.path} key={index} className={`${styles.sidebarItem} ${item.path === pathname ? styles.sidebarItemActive : ""
                                }`}>
                                {item.name}
                            </Link>
                        )
                    })}
                </>
                }
            </div>
        </div>
    )
}

export default Sidebar