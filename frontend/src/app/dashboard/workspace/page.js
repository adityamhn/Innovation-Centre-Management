"use client";

import React from "react";
import styles from "@/styles/pages/RegisterStartup.module.scss";
import { Alert, DatePicker, Form, Input, InputNumber, Row, Select, message } from "antd";
import formStyles from "@/styles/components/Form.module.scss";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {  getWorkspaceRequest, requestWorkspace } from "@/services/user.services";
import dayjs from "dayjs";
import LoaderPage from "@/components/common/Loader/LoaderPage";


const RequestWorkspace = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("workspace-request", getWorkspaceRequest);


  const requestWorkspaceMutation = useMutation(requestWorkspace, {
    onSuccess: async () => {
      messageApi.success("Workspace request sent successfully");
      await queryClient.invalidateQueries("workspace-request");
    },
    onError: (error) => {
      messageApi.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (values) => {
    await requestWorkspaceMutation.mutateAsync({
      workspaceType: values.workspaceType,
      reason: values.reason,
      membersCount: values.membersCount,
      from: values.timeline[0],
      to: values.timeline[1],
    });
  }

  if (isLoading) {
    return <LoaderPage />;
  }



  return (
    <>
    {contextHolder}
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>
            Request for Workspace
        </h1>
        <p className={styles.layoutDesc}>
            You can request for a workspace here. Please fill in the details below.
        </p>
        { data?.request?.status === "pending" && (
          <Alert
            message="Workspace request pending"
            description="Your workspace request is pending approval. You will be notified once it is approved."
            type="info"
            showIcon
            style={{ marginTop: "2rem" }}
          />
        )}
        <Form
        //   form={form}
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={data?.request?.status === "pending"}
          initialValues={{
            workspaceType: data?.request?.workspace_type,
            reason: data?.request?.reason,
            membersCount: data?.request?.members_count,
            timeline: [dayjs(data?.request?.from_date), dayjs(data?.request?.to_date)],
          }}
        >
          <Form.Item
            name="workspaceType"
            label="Select Workspace"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your Workspace!",
              },
            ]}
          >
            <Select
              style={{
                width: "100%",
              }}
              className={formStyles.formSelectTags}
              placeholder="Select Workspace"
              options={[
                { value: 'co-working', label: 'Co-working space' },
                { value: 'student-startups', label: 'Student startups' },
                { value: 'markerspace-lab', label: 'Makerspace space lab' },
                { value: 'rapid-prototyping', label: 'Rapid Prototyping' },
                { value: 'design-in-woods', label: 'Design in woods' },
                {
                  value: 'apple-creative-studio',
                  label: 'Apple Creative Studio',
                },
                {
                  value: 'central-instrumentation-facility',
                  label: 'Central Instrumentation Facility',
                }
              ]}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason for Workspace request"
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
            name="membersCount"
            label="How many members will be using the workspace?"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input the number of members!",
              }
            ]}
          >
            <InputNumber
            style={{width: '100%'}}
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                placeholder="Enter the number of members"
            />
          </Form.Item>

          <Form.Item
            name="timeline"
            label="How long do you need the workspace for?"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input the timeline!",
              }
            ]}
          >
            <DatePicker.RangePicker
            style={{width: '100%'}}
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                placeholder="Select the timeline"
                minDate={dayjs()}
            />
          </Form.Item>
       
       

          <Row>
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
              loading={requestWorkspaceMutation.isLoading}
            >
              {data?.request?.status === "pending" ? "Request Pending" : "Request Workspace"}
            </PrimaryButton>
          </Row>
        </Form>
      </div>
    </>
  )
}

export default RequestWorkspace