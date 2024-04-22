"use client";

import React from "react";
import styles from "@/styles/pages/RegisterStartup.module.scss";
import { Alert, Form, Input, Row, Select, Space, message } from "antd";
import formStyles from "@/styles/components/Form.module.scss";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getStartup,
  registerStartupRequest,
  updateStartup,
} from "@/services/user.services";
import LoaderPage from "@/components/common/Loader/LoaderPage";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const RegisterStartup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("get-startup", getStartup, {
    onSuccess: (data) => {
      form.setFieldsValue({
        name: data.startup?.name,
        description: data.startup?.description,
        pitch_deck_url: data.startup?.pitch_deck_url,
        pitch_video_url: data.startup?.pitch_video_url,
        logo_url: data.startup?.logo_url,
        industries: data.startup?.industry,
        members: data.startup?.members,
      });
    },
  });

  const registerStartupMutation = useMutation(registerStartupRequest, {
    onSuccess: async (data) => {
      messageApi.success(
        "Startup registered successfully! Admin will review it and get back to you soon."
      );

      await queryClient.invalidateQueries("get-startup");
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const updateStartupMutation = useMutation(updateStartup, {
    onSuccess: async (data) => {
      messageApi.success("Startup updated successfully!");

      await queryClient.invalidateQueries("get-startup");
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleRegisterStartup = async (values) => {
    if (data?.startup?.id) {
      await updateStartupMutation.mutateAsync({
        startup_id: data.startup.id,
        name: values.name,
        description: values.description,
        pitch_deck_url: values.pitch_deck_url,
        pitch_video_url: values.pitch_video_url,
        logo_url: values.logo_url,
        industries: values.industries,
        members: values.members,
      });
      return;
    }
    await registerStartupMutation.mutateAsync({
      name: values.name,
      description: values.description,
      pitch_deck_url: values.pitch_deck_url,
      pitch_video_url: values.pitch_video_url,
      logo_url: values.logo_url,
      industries: values.industries,
      members: values.members,
    });
  };

  if (isLoading || !data) {
    <LoaderPage />;
  }

  return (
    <>
      {contextHolder}
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>Register your startup</h1>
        <p className={styles.layoutDesc}>
          Register your startup to get access to the MIT Innovation Centre.
        </p>
        {data?.startup?.status === "pending" && (
          <Alert
            message="Startup pending review"
            description="Your startup is pending review by the administration at MIT Innovation centre. You will be notified once it is approved. "
            type="info"
            showIcon
            style={{ marginTop: "2rem" }}
          />
        )}
        {data?.startup?.status === "approved" && (
          <Alert
            message="Startup approved"
            description="Your startup has been approved by the administration at MIT Innovation centre. "
            type="success"
            showIcon
            style={{ marginTop: "2rem" }}
          />
        )}
        {data?.startup?.status === "invalid" && (
          <Alert
            message="Startup rejected"
            description="Your startup has been rejected by the administration at MIT Innovation centre. Please contact the administration for more details. "
            type="error"
            showIcon
            style={{ marginTop: "2rem" }}
          />
        )}
        {data?.startup?.status === "alumini" && (
          <Alert
            message="Startup is alumini"
            description="Your startup is alumini of MIT Innovation centre. "
            type="info"
            showIcon
            style={{ marginTop: "2rem" }}
          />
        )}
        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          onFinish={handleRegisterStartup}
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
            name="industries"
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

          <h3 className={formStyles.sectionLabel}>
            Enter Team Members details
          </h3>
          <Alert
            message="Make sure that all members have an account on the platform"
            description="Please make sure that all the team members have an account on the platform. If they don't have an account, ask them to create one."
            type="info"
            showIcon
            style={{ marginBottom: "1rem" }}
          />
          <Form.List name="members">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className={styles.memberSection}>
                    <Row justify="space-between">
                      <h4 className={styles.memberTitle}>
                        Team Member {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ fontSize: 20 }}
                        />
                      )}
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
                <Form.Item>
                  <PrimaryButton
                    onClick={() => add()}
                    className={styles.addMemberButton}
                    icon={<PlusOutlined />}
                  >
                    Add team member
                  </PrimaryButton>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row>
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
              loading={
                registerStartupMutation.isLoading ||
                updateStartupMutation.isLoading
              }
            >
              {data?.startup ? "Update startup" : "Register startup"}
            </PrimaryButton>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default RegisterStartup;
