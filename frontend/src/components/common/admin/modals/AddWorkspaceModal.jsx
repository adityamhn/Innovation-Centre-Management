import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { Form, Input, Modal, Radio, Row, Select, message } from 'antd'
import formStyles from "@/styles/components/Form.module.scss";

import PrimaryButton from '../../PrimaryButton';
import { addNewWorkspace, updateWorkspace } from '@/services/admin.services';
import { useMutation, useQueryClient } from 'react-query';


const AddWorkspaceModal = ({ visible, setVisible }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();


    const closeModal = () => {
        setVisible(false)
    }

    const addWorkspaceMutation = useMutation(addNewWorkspace, {
        onSuccess: async () => {
            messageApi.success("Workspace added successfully");
            await queryClient.invalidateQueries("all-workspaces");
            closeModal();
        },
        onError: (error) => {
            messageApi.error("Something went wrong. Please try again.");
        },
    });

    const updateWorkspaceMutation = useMutation(updateWorkspace, {
        onSuccess: async () => {
            messageApi.success("Workspace updated successfully");
            await queryClient.invalidateQueries("all-workspaces");
            closeModal();
        },
        onError: (error) => {
            messageApi.error(error.response.data.message);
        },
    });


    const handleAddWorkspace = async (values) => {
        if (visible.edit) {
            await updateWorkspaceMutation.mutateAsync({
                workspaceId: visible.workspace_id,
                name: values.name,
                description: values.description,
                location: values.location,
                size: values.size,
                amenities: values.amenities,
                available: values.available
            });
        } else {
            await addWorkspaceMutation.mutateAsync({
                name: values.name,
                description: values.description,
                location: values.location,
                size: values.size,
                amenities: values.amenities,
                available: values.available
            });
        }

    }


    useEffect(() => {
        if (visible.edit) {
            form.setFieldsValue({
                name: visible.name,
                description: visible.description,
                location: visible.location,
                size: visible.size,
                amenities: visible.amenities,
                available: visible.available
            })
        } else {
            form.resetFields()
        }
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
                        <h1 className={styles.heading}>{visible.edit ? "Edit" : "Add"} Workspace</h1>
                    </div>
                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleAddWorkspace}
                    >
                        <Form.Item
                            name="name"
                            label="Workspace Name"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Workspace Name',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Workspace name' />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Workspace Description"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Workspace Description',
                                }
                            ]}
                        >
                            <Input.TextArea className={`${formStyles.formTextArea} ${styles.modalInput}`} placeholder='Workspace description' />
                        </Form.Item>
                        <Form.Item
                            name="location"
                            label="Location"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Location',

                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Workspace location' />
                        </Form.Item>
                        <Form.Item

                            name="size"
                            label="Size"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Size',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Workspace size' />
                        </Form.Item>
                        <Form.Item
                            name="amenities"
                            label="Amenities"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Amenities',
                                }
                            ]}
                        >
                            <Select
                                mode="tags"
                                style={{
                                    width: "100%",
                                }}
                                className={formStyles.formSelectTags}
                                placeholder="Select Amenities"
                            />
                        </Form.Item>

                        <Form.Item
                            name="available"
                            label="Availability"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Availability',
                                }
                            ]}
                        >
                            <Radio.Group name="available" >
                                <Radio value={true}>
                                    Available
                                </Radio>
                                <Radio value={false}>
                                    Not Available
                                </Radio>
                            </Radio.Group>
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
                                loading={addWorkspaceMutation.isLoading || updateWorkspaceMutation.isLoading}
                            >{visible.edit ? "Update" : "Add"} Workspace</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default AddWorkspaceModal