"use client";

import React from "react";
import styles from "@/styles/pages/Login.module.scss";
import formStyles from "@/styles/components/Form.module.scss";
import { Form, Input, Radio, Row, message } from "antd";
import { emailRegex } from "@/services/constants";
import PrimaryButton from "@/components/common/PrimaryButton";
import Link from "next/link";
import { userRegisterRequest } from "@/services/auth.service";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const [form] = Form.useForm();
  const isMahe = Form.useWatch("is_mahe", form);

  const userRegisterMutation = useMutation(userRegisterRequest, {
    onSuccess: (data) => {
      messageApi.success("Registration successful! Please login to continue.", 5, () => {
        router.push(`/login`);
      });
      messageApi.success("Redirecting to login page...");
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleSubmit = async (values) => {
    await userRegisterMutation.mutateAsync({
      name: values.name,
      email: values.email,
      password: values.password,
      is_mahe: values.is_mahe,
      regno: values.regno,
    });
   
  };

  return (
    <>
      {contextHolder}
      <div className={styles.loginContainer}>
        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.authForm}`}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ is_mahe: true }}
        >
          <Form.Item
            name="name"
            label="Name"
            className={`${formStyles.formItem}`}
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
            name="email"
            label="Email"
            className={`${formStyles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                pattern: emailRegex,
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Create Password"
            className={`${formStyles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your password"
            />
          </Form.Item>
          <Form.Item
            name="is_mahe"
            label="Are you a MAHE student/employee?"
            className={`${formStyles.formItem}`}
            rules={[
              {
                required: true,
                message: "Please select an option!",
              },
            ]}
          >
            <Radio.Group name="is_mahe">
              <Radio value={true}>MAHE</Radio>
              <Radio value={false}>NON-MAHE</Radio>
            </Radio.Group>
          </Form.Item>
          {isMahe && (
            <Form.Item
              name="regno"
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
                className={`${formStyles.formInput}  ${styles.authEmailInput}`}
                placeholder="Enter your registration number"
              />
            </Form.Item>
          )}

          <Row>
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
              loading={userRegisterMutation.isLoading}
            >
              Register
            </PrimaryButton>
            <Link href="/login">
              <PrimaryButton
                className={`${formStyles.formButton} ${styles.loginButton}`}
                buttonType="text"
              >
                already have an account?
              </PrimaryButton>
            </Link>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Login;
