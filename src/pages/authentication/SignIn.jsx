import React, { useState, useEffect } from "react";
import {
  signIn,
  fetchUserAttributes,
  signInWithRedirect,
} from "@aws-amplify/auth";
import { Form, Input, Button, Alert, Collapse } from "antd";
import { GoogleOutlined } from "@ant-design/icons"; // For Google logo
import { useNavigate } from "react-router-dom";

// Context
import { useAuthContext } from "../../state/AuthContext";

// Hooks
import useUser from "../../hooks/backend-hooks/useUser";

// Styles
import styles from "./Auth.module.css";

function SignIn() {
  const { login } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showManualSignIn, setShowManualSignIn] = useState(false);

  const { authUser } = useUser();

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const amplifyUser = await signIn(username, password);
      const attributes = await fetchUserAttributes(amplifyUser);
      login({ ...amplifyUser, ...attributes });
    } catch (error) {
      console.error("Error signing in", error);
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error("Error signing in with Google", error);
      setError(error.message || "Failed to sign in with Google");
    }
  };

  useEffect(() => {
    if (authUser && authUser.userId) {
      navigate("/"); // Or your desired route after sign-in
    }
  }, [authUser, navigate]);

  return (
    <div className={styles.signInContainer}>
      <header className={styles.header}>
        <img
          src="/path-to-your-logo.png"
          alt="App Logo"
          className={styles.logo}
        />
        <h1>Welcome Back!</h1>
      </header>
      <div className={styles.buttonDiv}>
        <Button
          type="primary"
          onClick={handleGoogleSignIn}
          className={styles.googleSignInButton}
          icon={<GoogleOutlined />}
          size="large"
          block
        >
          Sign in with Google
        </Button>
        <Collapse className={styles.manualSignInCollapse}>
          <Collapse.Panel header="Sign in with Email and Password" key="1">
            <Form
              onFinish={handleSignIn}
              className={styles.form}
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
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
              {error && <Alert message={error} type="error" showIcon />}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Collapse.Panel>
        </Collapse>
        <Button
          type="link"
          onClick={() => navigate("/create-account")}
          className={styles.goBackButton}
        >
          Create Account
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

export default SignIn;
