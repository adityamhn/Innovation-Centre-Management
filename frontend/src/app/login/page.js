"use client";

import React from "react";
import styles from "@/styles/pages/Login.module.scss";
import formStyles from "@/styles/components/Form.module.scss";
import { Form, Input, Row } from "antd";
import { emailRegex } from "@/services/constants";
import PrimaryButton from "@/components/common/PrimaryButton";

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <Form
        className={`${formStyles.formContainer} ${styles.authForm}`}
        layout="vertical"
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
          <Row align="middle">
            <Input.Password
              className={`${formStyles.formInput}  ${styles.authEmailInput}`}
              placeholder="Enter your password"
            />
            <PrimaryButton
              className={`${styles.loginButton}`}
              buttonType="text"
            >
              forgot password?
            </PrimaryButton>
          </Row>
        </Form.Item>

        <Row>
          <PrimaryButton
            className={`${formStyles.formButton} ${styles.loginButton}`}
            htmlType="submit"
          >
            Login
          </PrimaryButton>
          <PrimaryButton
            className={`${formStyles.formButton} ${styles.loginButton}`}
            buttonType="text"
          >
            create new account
          </PrimaryButton>
        </Row>
      </Form>
    </div>
  );
};

export default Login;
