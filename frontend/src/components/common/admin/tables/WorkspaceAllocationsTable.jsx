import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { Table } from 'antd'
import Link from 'next/link';
import moment from 'moment';


const WorkspaceAllocationsTable = ({ data, setUserAllocation }) => {

    const columns = [
        {
            title: "Workspace",
            dataIndex: 'workspace',
            key: 'workspace',
            render: (_, record) => <>{record.workspace.name}</>
        },
        {
            title: 'From date',
            dataIndex: 'from_date',
            key: 'from_date',
            render: (date) => {
                return moment(date).format('DD-MM-YYYY')
            }
        },
        {
            title: 'To date',
            dataIndex: 'to_date',
            key: 'to_date',
            render: (date) => {
                return moment(date).format('DD-MM-YYYY')
            }
        },
        {
            title: 'Startup',
            dataIndex: 'startup',
            key: 'startup',
            render: (_, record) => <>{record.startup_id ? <Link
                href={`/admin/dashboard/startups/${record.startup_id}`}
                as={`/admin/dashboard/startups/${record.startup_id}`}
            >{record.startup?.name}</Link> : null}</>

        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'users',
            render: (_, record) => <Link
                href={`/admin/dashboard/users/${record.user_id}`}
                as={`/admin/dashboard/users/${record.user_id}`}
            >{record.user.name}</Link>

        }
    ];

    return (
        <div className={styles.tableContainer}>
            <Table
                style={{
                    width: '100%',
                }}
                dataSource={data}
                columns={columns}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: () => {
                            setUserAllocation({
                                ...record
                            })
                        }
                    }
                }
                }
            />
        </div>
    )
}

export default WorkspaceAllocationsTable