import { Form, Modal, Row, Select, message } from 'antd'
import React, { useEffect } from 'react'
import PrimaryButton from '../../PrimaryButton';
import styles from "@/styles/components/Modal.module.scss"
import formStyles from "@/styles/components/Form.module.scss";
import Link from 'next/link';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import { changeWorkspaceRequestStatus, deleteAllocation } from '@/services/admin.services';

const AllocationModal = ({
    visible,
    setVisible,
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    console.log(visible)

    const deleteAllocationMutation = useMutation(deleteAllocation, {
        onSuccess: async () => {
            messageApi.success("Allocation deleted successfully");
            await queryClient.invalidateQueries("all-allocations");
            closeModal();
        }
    });


    const closeModal = () => {
        setVisible(false)
    }


    const handleDelete = async (id) => {
        await deleteAllocationMutation.mutateAsync(id);
    }



    return (
        <>
            {contextHolder}
            <Modal
                open={visible}
                onCancel={closeModal}
                centered
                closeIcon={null}
                footer={null}
                className={styles.appModalContainer}
                width={600}
            >
                <div className={styles.appModalWrapper}>
                    <div className={styles.modalHeader}>
                        <h1 className={styles.heading}>Workspace Allocation</h1>
                    </div>

                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                    // onFinish={handleStatusChange}

                    >
                        <Form.Item
                            label="Wokspace"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            <Link href={`admin/dashboard/workspace/${visible?.workspace_id}`}>
                                {visible?.workspace?.name}
                            </Link>
                        </Form.Item>
                        <Form.Item
                            label="User"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            <Link href={`admin/dashboard/users/${visible?.user_id}`}>
                                {visible?.user?.name} - {visible?.user?.email}
                            </Link>
                        </Form.Item>
                        {visible?.startup_id && (
                            <Form.Item
                                label="Startup"
                                className={`${formStyles.formItem} ${styles.formItem}`}

                            >
                                <Link href={`admin/dashboard/startups/${visible?.startup_id}`}>
                                    {visible?.startup?.name}
                                </Link>
                            </Form.Item>

                        )}

                        <Form.Item
                            label="From - To Date"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {moment(visible?.start_date).format('DD-MM-YYYY')} to {moment(visible?.end_date).format('DD-MM-YYYY')}
                        </Form.Item>

                        <Row justify="end" className={styles.modalButtonsContainer}>
                            <PrimaryButton
                                size="small"
                                buttonType="text"
                                className={`${styles.formButton} ${styles.modalCancelButton}`}
                                onClick={closeModal}
                            >Cancel</PrimaryButton>
                            <PrimaryButton
                                size="small"
                                className={`${styles.formButton} ${styles.modalButton}`}
                                htmlType='submit'
                                style={{ backgroundColor: "red" }}
                                onClick={() => handleDelete(visible?.allocation_id)}
                                loading={deleteAllocationMutation.isLoading}
                            >
                                Delete Allocation
                            </PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default AllocationModal