"use client";

import React from "react";
import styles from "@/styles/pages/Login.module.scss";
import formStyles from "@/styles/components/Form.module.scss";
import { Form, Input, Row, message } from "antd";
import { emailRegex } from "@/services/constants";
import PrimaryButton from "@/components/common/PrimaryButton";
import { sendAdminLoginRequest } from "@/services/admin.services";
import { useMutation } from "react-query";
import { loginUser } from "@/store/user.slice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();


  const adminLoginMutation = useMutation(sendAdminLoginRequest, {
    onSuccess: (data) => {
      messageApi.success("Login successful!");
      dispatch(loginUser(data.user));
      router.push(`/admin/dashboard`);
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleLogin = async (values) => {
    await adminLoginMutation.mutateAsync({
      email: values.email,
      password: values.password,
    });
  };
  return (
    <>
      {contextHolder}
      <div className={styles.loginContainer}>
        <Form
          className={`${formStyles.formContainer} ${styles.authForm}`}
          layout="vertical"
          onFinish={handleLogin}
        >
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
            label="Password"
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

          <Row>
            <PrimaryButton
              className={`${formStyles.formButton} ${styles.loginButton}`}
              htmlType="submit"
            >
              Login
            </PrimaryButton>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Login;
