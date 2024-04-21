import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { Table } from 'antd'
import Link from 'next/link';


const StartupsTable = ({data}) => {


    const columns = [
        {
            title: 'Startup Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <Link 
                href={`/admin/dashboard/startups/${record.id}`}
                as={`/admin/dashboard/startups/${record.id}`}
            >{name}</Link>
        },
        {
            title: 'industry',
            dataIndex: 'industry',
            key: 'industry',
            render: (industry) => {
                return industry.join(', ')
            }
        },
        {
            title: 'admin',
            dataIndex: 'startup_admin',
            key: 'astartup_admin',
            render: (admin) => {
                return admin.email
            }
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    return (
        <div className={styles.tableContainer}>
            <Table
                dataSource={data}
                columns={columns}
            />
        </div>
    )
}

export default StartupsTable