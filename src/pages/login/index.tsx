import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, notification, Form, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";

const { Title } = Typography;

interface LoginProps {
  onLogin: () => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values: LoginFormValues) => {
    setLoading(true);
    const userList = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = userList.find(
      (user: { username: string; password: string }) =>
        user.username === values.username && user.password === values.password
    );
    if (foundUser) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      notification.success({
        message: "Đăng Nhập Thành Công",
        description: "Chào mừng trở lại!",
        duration: 3,
        style: { backgroundColor: "#52c41a", color: "white" },
      });
      onLogin();
      navigate("/dashboard");
    } else {
      notification.error({
        message: "Đăng Nhập Thất Bại",
        description: "Tên đăng nhập hoặc mật khẩu không đúng!",
        duration: 3,
        style: { backgroundColor: "#f5222d", color: "white" },
      });
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <Title level={2} className="login-title">Đăng Nhập</Title>
          <Form
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Hãy điền tên đăng nhập!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Hãy điền mật khẩu!" }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                onClick={() => navigate("/register")}
                className="register-link"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
