import { DatePicker, Form, Input, InputNumber, Modal, Row, Select, message } from 'antd'
import React, { useEffect } from 'react'
import PrimaryButton from '../../PrimaryButton';
import styles from "@/styles/components/Modal.module.scss"
import formStyles from "@/styles/components/Form.module.scss";
import dayjs from 'dayjs';
import Link from 'next/link';
import moment from 'moment';

const WorkspaceRequestModal = ({
    visible,
    setVisible,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    console.log(visible)



    const closeModal = () => {
        setVisible(false)
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
                        <h1 className={styles.heading}>Workspace Request</h1>
                    </div>

                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        
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
                            label="Select Workspace"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {visible?.workspace_type}
                        </Form.Item>
                        <Form.Item
                            label="Reason for Workspace request"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {visible?.reason}
                        </Form.Item>
                        <Form.Item
                            label="How many members will be using the workspace?"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {visible?.members_count}
                        </Form.Item>

                        <Form.Item
                            label="How long do you need the workspace for?"
                            className={`${formStyles.formItem} ${styles.formItem}`}

                        >
                            {moment(visible?.from_date).format('DD-MM-YYYY')} - {moment(visible?.to_date).format('DD-MM-YYYY')}
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
                            // loading={addWorkspaceMutation.isLoading || updateWorkspaceMutation.isLoading}
                            >Update Status</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default WorkspaceRequestModal