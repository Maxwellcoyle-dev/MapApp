import React, { useState } from "react";
import { signUp, signInWithRedirect } from "@aws-amplify/auth";
import { Form, Input, Button, Alert, Collapse } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../state/AuthContext";
import styles from "./Auth.module.css";
import logo from "../../assets/mesavibe-logo-v2-192.png";

function CreateAccount() {
  const { setAuthUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const newUser = await signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      setAuthUser(newUser);
      navigate("/"); // Or your desired route after account creation
    } catch (error) {
      console.error("Error creating account", error);
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error("Error signing up with Google", error);
      setError(error.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className={styles.signInContainer}>
      <header className={styles.header}>
        <img src={logo} alt="App Logo" className={styles.logo} />
        <h1>Create Your Account</h1>
      </header>
      <div className={styles.buttonDiv}>
        <Button
          type="primary"
          onClick={handleGoogleSignUp}
          className={styles.googleSignInButton}
          icon={<GoogleOutlined />}
          size="large"
          block
        >
          Sign up with Google
        </Button>
        <Collapse className={styles.manualSignInCollapse}>
          <Collapse.Panel header="Sign up with Email" key="1">
            <Form
              onFinish={handleCreateAccount}
              className={styles.form}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                ]}
              >
                <Input.Password
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </Form.Item>
              {error && <Alert message={error} type="error" showIcon />}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </Collapse.Panel>
        </Collapse>
        <Button
          type="link"
          onClick={() => navigate("/login")}
          className={styles.goBackButton}
        >
          Already have an account? Sign in
        </Button>
        <Button
          type="link"
          onClick={() => navigate(-1)}
          className={styles.goBackButton}
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}

export default CreateAccount;
