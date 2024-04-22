import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { DatePicker, Form, Input, Modal, Radio, Row, Select, message } from 'antd'
import formStyles from "@/styles/components/Form.module.scss";

import PrimaryButton from '../../PrimaryButton';
import { addNewWorkspace, allocateWorkspace, updateWorkspace } from '@/services/admin.services';
import { useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';


const AllocateWorkspaceModal = ({ visible, setVisible, workspaces, startups, users }) => {
    const [form] = Form.useForm();
    const startupId = Form.useWatch('startupId', form);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();



    const closeModal = () => {
        setVisible(false)
    }

    const allocateMutation = useMutation(allocateWorkspace, {
        onSuccess: async () => {
            messageApi.success("Workspace allocated successfully");
            await queryClient.invalidateQueries("all-allocations");
            closeModal();
        },
        onError: (error) => {
            messageApi.error("Something went wrong. Please try again.");

        },
    });
    const handleSubmit = async (values) => {
        await allocateMutation.mutateAsync({
            workspace_id: values.workspace_id,
            startupId: values.startupId,
            users: values.users,
            start_date: values.timeline[0],
            end_date: values.timeline[1]
        });

    }


    useEffect(() => {
        if (startupId) {
            const startup = startups.find(startup => startup.id === startupId);
            const users = [startup.startup_admin.id];

            for (let user of startup.members) {
                users.push(user.user_id)
            }

            form.setFieldsValue({
                users
            })

        }
    }, [startupId])



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
                        <h1 className={styles.heading}>
                            Allocate Workspace
                        </h1>
                    </div>
                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleSubmit}
                    >

                        <Form.Item
                            name="workspace_id"
                            label="Workspace"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Workspace',
                                }
                            ]}
                        >
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                className={formStyles.formSelectTags}
                                placeholder="Select Workspace"
                                options={workspaces.map(workspace => ({
                                    label: workspace.name,
                                    value: workspace.workspace_id
                                }))
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="startupId"
                            label="Startup"
                            className={formStyles.formItem}
                        >
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                className={formStyles.formSelectTags}
                                placeholder="Select Startup"
                                options={
                                    startups.map(startup => ({
                                        label: startup.name,
                                        value: startup.id
                                    }))
                                }
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item
                            name="users"
                            label="Users"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select users',
                                }
                            ]}
                        >
                            <Select
                                mode='multiple'
                                style={{
                                    width: "100%",
                                }}
                                className={formStyles.formSelectTags}
                                placeholder="Select users"
                                options={
                                    users.map(user => ({
                                        label: `${user.name} (${user.email})`,
                                        value: user.id
                                    }))
                                }
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }

                            />
                        </Form.Item>

                        <Form.Item
                            name="timeline"
                            label="Select from and to date"
                            className={`${formStyles.formItem} ${styles.formItem}`}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the timeline!",
                                }
                            ]}
                        >
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                                placeholder="Select the timeline"
                                minDate={dayjs()}
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
                                loading={allocateMutation.isLoading}
                            >
                                Allocate Workspace
                            </PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default AllocateWorkspaceModal