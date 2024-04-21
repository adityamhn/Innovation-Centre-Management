import { Table } from 'antd';
import React from 'react'
import styles from '@/styles/components/Table.module.scss'


const WorkspaceTable = ({ data, setCreateWorkspaceModalVisible }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <a
                onClick={() => setCreateWorkspaceModalVisible({
                    ...record,
                    edit: true
                })}
            >{name}</a>
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'available',
            dataIndex: 'available',
            key: 'available',
            render: (available) => {
                return available ? 'Yes' : 'No'
            }
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
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

export default WorkspaceTable