import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { Table } from 'antd'
import Link from 'next/link';


const UsersTable = ({data}) => {


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <Link 
                href={`/admin/dashboard/users/${record.id}`}
                as={`/admin/dashboard/users/${record.id}`}
            >{name}</Link>
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'is Mahe',
            dataIndex: 'is_mahe',
            key: 'is_mahe',
            render: (is_mahe) => {
                return is_mahe ? 'Yes' : 'No' 
            }
        },
        {
            title: 'Registration No.',
            dataIndex: 'reg_no',
            key: 'reg_no',
        },
        {
            title: 'Phone',
            dataIndex: 'contact',
            key: 'contact',
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

export default UsersTable