"use client";

import React from "react";
import styles from "@/styles/pages/RegisterStartup.module.scss";
import { Form, Input, Row, Select, message } from "antd";
import formStyles from "@/styles/components/Form.module.scss";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useMutation, useQuery } from "react-query";
import { getStartup, registerStartupRequest } from "@/services/user.services";
import LoaderPage from "@/components/common/Loader/LoaderPage";

const RegisterStartup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [startup, setStartup] = React.useState(null);
  // const router = useRouter();
  // const dispatch = useDispatch();

  const { data, isLoading } = useQuery("get-startup", getStartup);

  const registerStartupMutation = useMutation(registerStartupRequest, {
    onSuccess: (data) => {
      messageApi.success(
        "Startup registered successfully! Admin will review it and get back to you soon."
      );
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleRegisterStartup = async (values) => {
    await registerStartupMutation.mutateAsync({
      name: values.name,
      description: values.description,
      pitch_deck_url: values.pitch_deck_url,
      pitch_video_url: values.pitch_video_url,
      logo_url: values.logo_url,
      industries: values.industries,
    });
  };

  if (isLoading ) {
    <LoaderPage />;
  }

  return (
    <>
      {contextHolder}
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>Register your Startup</h1>
        <p className={styles.layoutDesc}>
          Register your startup to get access to the MIT Innovation Centre.
        </p>
        <Form
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          onFinish={handleRegisterStartup}
          initialValues={data?.startup}
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

          <Row>
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
              loading={registerStartupMutation.isLoading}
            >
              Register Startup
            </PrimaryButton>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default RegisterStartup;
