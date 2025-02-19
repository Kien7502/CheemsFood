import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const RegisterForm = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // API
  };

  return (
    <Form name="register" onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập địa chỉ email!' },
          { type: 'email', message: 'Địa chỉ email không hợp lệ!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;