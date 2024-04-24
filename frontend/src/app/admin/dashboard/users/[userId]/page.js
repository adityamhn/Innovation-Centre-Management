"use client";

import React from "react";
import styles from "@/styles/pages/admin/Startup.module.scss";
import { DatePicker, Form, Input, Radio  } from "antd";
import formStyles from "@/styles/components/Form.module.scss";
import {
  getUser,
} from "@/services/admin.services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoaderPage from "@/components/common/Loader/LoaderPage";
import dayjs from "dayjs";
import Link from "next/link";

const UsersPage = ({ params }) => {
  const { userId } = params;
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery("get_user", () => getUser(userId), {
    enabled: !!userId,
  });

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <>
      <div className={styles.registerStartupContainer}>
        <h1 className={styles.layoutTitle}>User Details</h1>

        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.registerForm}`}
          layout="vertical"
          initialValues={{
            ...data?.user,
            date_of_birth: dayjs(data?.user.date_of_birth).format("YYYY-MM-DD"),
          }}
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
          {data?.user.is_mahe && (
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
            label="Date of Birth"
            className={`${formStyles.formItem} ${styles.formItem}`}
          >
            <DatePicker
            value={dayjs(data?.user.date_of_birth)}
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

          {data?.user.startup && (
            <>
          <h3 className={formStyles.sectionLabel}>Startup</h3>
          <div className={styles.startupDetails}>
            <p 
            >
              <span className={styles.detailsLabel}>Startup Name:</span>{" "}
              <Link href={`/admin/dashboard/startups/${data?.user.startup.id}`}>
              {data?.user.startup.name}
              </Link>
            </p>
            <p>
                <span className={styles.detailsLabel}>Role:</span>{" "}
                {data?.user.startup.type === "admin" ? "Admin" : data?.user.startup.role}
            </p>
            </div>
            </>
          )}

        </Form>
      </div>
    </>
  );
};

export default UsersPage;
