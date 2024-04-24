"use client";

import PrimaryButton from "@/components/common/PrimaryButton";
import { Alert, Form, Input, Row, message, notification } from "antd";
import React from "react";
import formStyles from "@/styles/components/Form.module.scss";
import styles from "@/styles/pages/RegisterStartup.module.scss";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserMentorshipRequests, requestMentorship } from "@/services/user.services";


const Mentorship = () => {
  const queryClient = useQueryClient();
    const [notificationApi, contextHolder] = notification.useNotification();

    const {data, isLoading} = useQuery("mentorship-request", getUserMentorshipRequests)

    const requestMutation = useMutation(requestMentorship, {
        onSuccess: async () => {
            notificationApi.success({
                message: "Mentorship request sent successfully",
                description: "Your mentorship request has been sent successfully",
            });
            await queryClient.invalidateQueries("mentorship-request");
        },
    })

    const onFinish = async (values) => {
        await requestMutation.mutateAsync(values);
    }
  return (
    <>
    {contextHolder}
    <div className={styles.registerStartupContainer}>
      <h1 className={styles.layoutTitle}>Request for Mentorship</h1>
      <p className={styles.layoutDesc}>
        Do you need mentorship for your startup? Fill out the form below to
        request for mentorship. Innovative ideas need mentorship to grow and
        succeed. Our mentors are here to help you with your startup journey.
      </p>
      {data?.requests && data?.requests?.length > 0 && (
        <Alert
          message="Mentorship Request Sent Successfully"
          description="Your mentorship request has been sent successfully. You will be contacted by a mentor soon."
          type="success"
          showIcon
          style={{ marginTop: "2rem" }}
          />
      )}

      <Form
        //   form={form}
        className={`${formStyles.formContainer} ${styles.registerForm}`}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="area_of_interest"
          label="Area of Interest"
          className={`${formStyles.formItem} ${styles.formItem}`}
          rules={[
            {
              required: true,
              message: "Please input your area of interest!",
            },
          ]}
        >
          <Input
            className={`${formStyles.formInput}  ${styles.authEmailInput}`}
            placeholder="Enter your area of interest"
          />
        </Form.Item>
        <Form.Item
          name="request_details"
          label="Description"
          className={`${formStyles.formItem} ${styles.formItem}`}
          rules={[
            {
              required: true,
              message: "Please input your reason!",
            },
          ]}
        >
          <Input.TextArea
            style={{ minHeight: 350 }}
            className={`${formStyles.formInput}  ${styles.authEmailInput}`}
            placeholder="Enter your reason for workspace request"
          />
        </Form.Item>
        <Form.Item
          name="available_days"
          label="Availability"
          className={`${formStyles.formItem} ${styles.formItem}`}
          rules={[
            {
              required: true,
              message: "Please input your availability!",
            },
          ]}
        >
          <Input
            className={`${formStyles.formInput}  ${styles.authEmailInput}`}
            placeholder="Any time constraints or periods when they are not available (e.g., exam weeks)"
          />
        </Form.Item>

        <Row>
          <PrimaryButton
            className={`${formStyles.formButton} ${styles.loginButton}`}
            htmlType="submit"
            loading={requestMutation.isLoading}
          >
            Request Mentorship
          </PrimaryButton>
        </Row>
      </Form>
    </div>
    </>

  );
};

export default Mentorship;
