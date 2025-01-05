import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, notification, Form, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';

const { Title } = Typography;

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  interface RegisterFormValues {
    fullname: string;
    username: string;
    password: string;
  }

  const handleRegister = (values: RegisterFormValues) => {
    const { fullname, username, password } = values; // Lấy giá trị username và password từ values
    const userList = JSON.parse(localStorage.getItem('users') || '[]');
    userList.push({ fullname, username, password });
    localStorage.setItem('users', JSON.stringify(userList));

    // also set user to store
    
    notification.success({
      message: 'Đăng ký thành công',
      description: 'Bạn có thể đăng nhập ngay bây giờ',
      duration: 3,
      style: {
        backgroundColor: '#52c41a',
        color: 'white',
      },
    });
    navigate('/login');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <Title level={2} className="login-title">
            Đăng Ký
          </Title>
          <Form name="login" className="login-form" initialValues={{ remember: true }} onFinish={handleRegister}>
            <Form.Item name="fullname" rules={[{ required: true, message: 'Họ tên của bạn là gì?' }]}>
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item name="username" rules={[{ required: true, message: 'Hãy điền tên đăng nhập!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Hãy điền mật khẩu!' }]}>
              <Input prefix={<LockOutlined />} type="password" placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                Đăng ký
              </Button>
              <div style={{ position: 'relative' }}>
                <Button type="link" onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>
                  Đăng Nhập
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
