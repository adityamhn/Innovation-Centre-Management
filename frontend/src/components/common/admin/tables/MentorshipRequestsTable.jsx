import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { Table } from 'antd'
import Link from 'next/link';
import moment from 'moment';


const MentorshipRequestsTable = ({ data, setRequestModal }) => {


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
            title: 'Area of interest',
            dataIndex: 'area_of_interest',
            key: 'area_of_interest',
        },
        {
            title: 'Request details',
            dataIndex: 'request_details',
            key: 'request_details',
        },
        {
            title: 'Available days',
            dataIndex: 'available_days',
            key: 'available_days',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
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

export default MentorshipRequestsTable