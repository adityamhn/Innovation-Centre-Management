"use client";

import React from "react";
import formStyles from "@/styles/components/Form.module.scss";
import styles from "@/styles/pages/admin/Startup.module.scss";
import { DatePicker, Form, Input, Select, message } from "antd";
import PrimaryButton from "@/components/common/PrimaryButton";
import { addInfo } from "@/services/admin.services";
import { useMutation } from "react-query";
import moment from "moment";

const AddInformation = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const newsType = Form.useWatch("type", form);

  const addInfoMutation = useMutation(addInfo, {
    onSuccess: () => {
      messageApi.success("Information added successfully");
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error(error.message);
    },
  });

  const onFinish = async (values) => {
    if (values.type === "event") {
      values.date = moment(values.date).format("YYYY-MM-DD");
    }
    await addInfoMutation.mutateAsync(values);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>Startup Details</h1>

        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="type"
            label="Select News Type"
            className={`${formStyles.formItem} ${styles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your news type!",
              },
            ]}
          >
            <Select
              style={{
                width: "100%",
              }}
              className={formStyles.formSelectTags}
              placeholder="Select the type of news"
              options={[
                {
                  label: "News",
                  value: "news",
                },
                {
                  label: "Event",
                  value: "event",
                },
                {
                  label: "Opportunity",
                  value: "opportunity",
                },
              ]}
            />
          </Form.Item>
          {newsType === "news" && (
            <>
              <Form.Item
                name="title"
                label="Title"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the title"
                />
              </Form.Item>
              <Form.Item
                name="content"
                label="Content"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <Input.TextArea
                  style={{ minHeight: 350 }}
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the content"
                />
              </Form.Item>
            </>
          )}
          {newsType === "event" && (
            <>
              <Form.Item
                name="title"
                label="Title"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the title"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <Input.TextArea
                  style={{ minHeight: 350 }}
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the description"
                />
              </Form.Item>

              <Form.Item
                name="eventDate"
                label="Date"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the date"
                />
              </Form.Item>
              <Form.Item
                name="location"
                label="Location"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your location!",
                  },
                ]}
              >
                <Input
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the location"
                />
              </Form.Item>
            </>
          )}

          {newsType === "opportunity" && (
            <>
              <Form.Item
                name="opportunityDetails"
                label="Opportunity Details"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your details!",
                  },
                ]}
              >
                <Input.TextArea
                  style={{ minHeight: 350 }}
                  className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                  placeholder="Enter the details"
                />
              </Form.Item>
              <Form.Item
                name="visibility"
                label="Select visibility of the opportunity"
                className={`${formStyles.formItem} ${styles.formItem}`}
                rules={[
                  {
                    required: true,
                    message: "Please input your visibility!",
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
            </>
          )}
          <PrimaryButton
            htmlType={"submit"}
            // onClick={handleUpdateStatus}
            className={`${formStyles.formButton} ${styles.loginButton}`}
            loading={addInfoMutation.isLoading}
          >
            Add Information
          </PrimaryButton>
        </Form>
      </div>
    </>
  );
};

export default AddInformation;
