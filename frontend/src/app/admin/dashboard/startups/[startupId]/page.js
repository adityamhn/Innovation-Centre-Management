"use client";

import React from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import { Form, Input, Row, Select, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PrimaryButton from "@/components/common/PrimaryButton";
import formStyles from "@/styles/components/Form.module.scss";
import { getStartup, updateStartupStatus } from "@/services/admin.services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";

const StartupPage = ({ params }) => {
  const { startupId } = params;
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery("startup", () => getStartup(startupId), {
    enabled: !!startupId,
  });

  const updateStatusMutation = useMutation(updateStartupStatus, {
    onSuccess: async () => {
      messageApi.success("Status updated successfully");
      await queryClient.invalidateQueries("startup");
    },
  });

  const handleUpdateStatus = async () => {
    const status = form.getFieldValue("status");
    await updateStatusMutation.mutateAsync({ status, startupId, public_profile: form.getFieldValue("public_profile")});
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <>
      {contextHolder}
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>Startup Details</h1>

        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          initialValues={{
            ...data?.startup,
            admin: data?.startup?.startup_admin?.email,
          }}
        >
          <Form.Item
            name="name"
            label="Startup Name"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your startup name!",
              },
            ]}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your startup name"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Startup Description"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your description!",
              },
            ]}
          >
            <Input.TextArea
              style={{ minHeight: 200 }}
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your description"
            />
          </Form.Item>
          <Form.Item
            name="pitch_deck_url"
            label="Pitch Deck URL"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your pitch deck URL!",
              },
              {
                type: "url",
                message: "Please enter a valid URL!",
              },
            ]}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your pitch deck URL"
            />
          </Form.Item>
          <Form.Item
            name="pitch_video_url"
            label="Pitch Video URL"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your pitch video URL!",
              },
              {
                type: "url",
                message: "Please enter a valid URL!",
              },
            ]}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your pitch video URL"
            />
          </Form.Item>
          <Form.Item
            name="logo_url"
            label="Startup logo URL"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your startup logo URL!",
              },
              {
                type: "url",
                message: "Please enter a valid URL!",
              },
            ]}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your startup logo URL"
            />
          </Form.Item>

          <Form.Item
            name="industry"
            label="Industries"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please select the industries your startup is in!",
              },
            ]}
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              className={formStyles.formSelectTags}
              maxCount={3}
              minCount={1}
              placeholder="Mention the industries your startup is in"
            />
          </Form.Item>

          <h3 className={formStyles.sectionLabel}>Admin</h3>

          <Form.Item
            label={`Admin Email`}
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your team members email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              readOnly
              disabled
              value={data?.startup?.startup_admin?.email}
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your team members email"
            />
          </Form.Item>

          <Form.Item
            label={`Admin Name`}
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your team members email!",
              },
            ]}
          >
            <Input
              readOnly
              disabled
              value={data?.startup?.startup_admin?.name}
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your team members email"
            />
          </Form.Item>

          <h3 className={formStyles.sectionLabel}>
            Enter Team Members details
          </h3>

          <Form.List name="members">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className={styles.memberSection}>
                    <Row justify="space-between">
                      <h4 className={styles.memberTitle}>
                        Team Member {index + 1}
                      </h4>
                    </Row>
                    <Form.Item
                      {...restField}
                      name={[name, "email"]}
                      label={`Team Member ${index + 1} Email`}
                      className={`${formStyles.formItem} ${styles.formItem}`}
                      rules={[
                        {
                          required: true,
                          message: "Please input your team members email!",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input
                        className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                        placeholder="Enter your team members email"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "role"]}
                      label={`Team Member ${index + 1} Role`}
                      className={`${formStyles.formItem} ${styles.formItem}`}
                      rules={[
                        {
                          required: true,
                          message: "Please input your role!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        style={{ minHeight: 75 }}
                        className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                        placeholder="Enter the person role in the startup"
                      />
                    </Form.Item>

                    {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                  </div>
                ))}
                {/* <Form.Item>
                <PrimaryButton
                  onClick={() => add()}
                  className={styles.addMemberButton}
                  icon={<PlusOutlined />}
                >
                  Add team member
                </PrimaryButton>
              </Form.Item> */}
              </>
            )}
          </Form.List>

          <h3 className={formStyles.sectionLabel}>Update Status</h3>

          <Form.Item
            name="status"
            label="Status"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Select the status of the startup!",
              },
            ]}
          >
            <Select
              className={formStyles.formSelectTags}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Invalid", value: "invalid" },
                { label: "Alumni", value: "alumni" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="public_profile"
            label="Make Public"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Select if the startup is public!",
              },
            ]}
          >
            <Select
              className={formStyles.formSelectTags}
              options={[
                {
                  label: "Yes",
                  value: true,
                },
                {
                  label: "No",
                  value: false,
                },
              ]}
            />
          </Form.Item>
          <PrimaryButton
            onClick={handleUpdateStatus}
            className={`${formStyles.formButton} ${styles.loginButton}`}
              loading={updateStatusMutation.isLoading}
          >
            Update status
          </PrimaryButton>

          <Row>
            {/* {!data?.startup  ? (
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
              loading={registerStartupMutation.isLoading}
            >
             Register startup
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              disabled
            >
              Startup registered
            </PrimaryButton>
          
          )} */}
          </Row>
        </Form>
      </div>
    </>
  );
};

export default StartupPage;
