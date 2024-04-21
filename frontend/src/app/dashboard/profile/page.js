"use client";

import React from "react";
import styles from "@/styles/pages/RegisterStartup.module.scss";
import { DatePicker, Form, Input, Radio, Row, message } from "antd";
import formStyles from "@/styles/components/Form.module.scss";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserProfile, updateUserProfile } from "@/services/user.services";
import LoaderPage from "@/components/common/Loader/LoaderPage";

const UserProfile = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isMahe = Form.useWatch("is_mahe", form);

  const { data, isLoading } = useQuery("user-profile", getUserProfile);

  const updateProfileMutation = useMutation(updateUserProfile, {
    onSuccess: async () => {
      messageApi.success("Profile updated successfully");
      await queryClient.invalidateQueries("user-profile");
    },
    onError: (error) => {
      messageApi.error(error.response.data.message);
    },
  });

  const handleSubmit = async (values) => {
    await updateProfileMutation.mutateAsync({
      name: values.name,
      contact: values.contact,
      date_of_birth: values.date_of_birth,
    });
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <>
      {contextHolder}
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>My Profile</h1>
        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          initialValues={data?.user}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your name"
            />
          </Form.Item>
          <Form.Item
            label="Email"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              disabled
              readOnly
              value={data?.user.email}
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your email"
            />
          </Form.Item>
          <Form.Item
            label="Are you a MAHE student/employee?"
            className={`${formStyles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please select an option!",
              },
            ]}
          >
            <Radio.Group name="is_mahe" disabled value={data?.user.is_mahe}>
              <Radio value={true}>MAHE</Radio>
              <Radio value={false}>NON-MAHE</Radio>
            </Radio.Group>
          </Form.Item>
          {isMahe && (
            <Form.Item
              label="Registration Number"
              className={`${formStyles.formItem}`}
              rules={[
                {
                  required: true,
                  message: "Please input your registration number!",
                },
              ]}
            >
              <Input
                readOnly
                disabled
                value={data?.user.reg_no}
                className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                placeholder="Enter your registration number"
              />
            </Form.Item>
          )}

          <Form.Item
            name="date_of_birth"
            label="Date of Birth"
            className={`${formStyles.formItem} ${styles.formItem}`}
          >
            <DatePicker
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your date of birth"
            />
          </Form.Item>

          <Form.Item
            name="contact"
            label="Phone Number"
            className={`${formStyles.formItem} ${styles.formItem}`}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your phone number"
            />
          </Form.Item>

          <Row>
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
            >
              Save changes
            </PrimaryButton>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default UserProfile;
