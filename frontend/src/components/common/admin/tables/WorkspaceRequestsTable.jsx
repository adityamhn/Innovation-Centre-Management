import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { Table } from 'antd'
import Link from 'next/link';
import moment from 'moment';


const WorkspaceRequestsTable = ({ data, setRequestModal }) => {


    const columns = [
        {
            title: "Requested on",
            dataIndex: 'request_date',
            key: 'request_date',
            render: (date) => {
                return moment(date).format('lll')
            }

        },
        {
            title: 'Requested by',
            dataIndex: 'requester',
            key: 'requester',
            render: (_, record) => <Link
                href={`/admin/dashboard/users/${record.user_id}`}
                as={`/admin/dashboard/users/${record.user_id}`}
            >{record.user.name}</Link>
        },
        {
            title: 'Workspace type',
            dataIndex: 'workspace_type',
            key: 'workspace_type',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'From date',
            dataIndex: 'from_date',
            key: 'from_date',
            render: (date) => {
                return moment(date).format('lll')
            }
        },
        {
            title: 'To date',
            dataIndex: 'to_date',
            key: 'to_date',
            render: (date) => {
                return moment(date).format('lll')
            }
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
                            setRequestModal({
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

export default WorkspaceRequestsTable