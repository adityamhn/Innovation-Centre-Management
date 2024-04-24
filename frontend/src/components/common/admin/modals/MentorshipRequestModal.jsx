import { Form, Modal, Row, Select, message } from 'antd'
import React, { useEffect } from 'react'
import PrimaryButton from '../../PrimaryButton';
import styles from "@/styles/components/Modal.module.scss"
import formStyles from "@/styles/components/Form.module.scss";
import Link from 'next/link';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';
import { changeMentorshipRequestStatus, changeWorkspaceRequestStatus } from '@/services/admin.services';

const MentorshipRequestModal = ({
    visible,
    setVisible,
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();



    const closeModal = () => {
        setVisible(false)
    }

    const changeStatusMutation = useMutation(changeMentorshipRequestStatus, {
        onSuccess: async () => {
            messageApi.success("Status updated successfully");
            await queryClient.invalidateQueries("all-mentorship-requests");
            closeModal();
        },
        onError: (error) => {
            messageApi.error("Something went wrong. Please try again.");
        },
    });

    const handleStatusChange = async (values) => {
        await changeStatusMutation.mutateAsync({
            requestId: visible.request_id,
            status: values.status
        });
    
    }

    useEffect(() => {
        form.setFieldsValue({
            status: visible?.status
        })
    }, [visible, form])



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
                        <h1 className={styles.heading}>Mentorship Request</h1>
                    </div>

                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleStatusChange}

                    >
                        <Form.Item
                            label="Requester Name"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            <Link href={`/admin/dashboard/users/${visible?.user?.id}`}>
                                {visible?.user?.name}
                            </Link>
                        </Form.Item>
                        <Form.Item
                            label="Requested On"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {moment(visible?.request_date).format('DD-MM-YYYY')}
                        </Form.Item>
                        <Form.Item
                            label="Area of Interest"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {visible?.area_of_interest}
                        </Form.Item>
                        <Form.Item
                            label="Request Details"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {visible?.request_details}
                        </Form.Item>
                        <Form.Item
                            label="Available Days"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {visible?.available_days}
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Status',
                                }
                            ]}
                        >
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                className={formStyles.formSelectTags}
                                placeholder="Select Status"
                                options={[
                                    {
                                        label: 'Approved',
                                        value: 'approved'
                                    },
                                    {
                                        label: 'Rejected',
                                        value: 'rejected'
                                    },
                                    {
                                        label: 'Pending',
                                        value: 'pending'
                                    }

                                ]}
                            />
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
                            loading={handleStatusChange.isLoading}
                            >Update Status</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default MentorshipRequestModal