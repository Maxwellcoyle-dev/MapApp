import React, { useState, useEffect } from "react";
import {
  signIn,
  fetchUserAttributes,
  signInWithRedirect,
} from "@aws-amplify/auth";
import { Hub } from "aws-amplify";
import { Form, Input, Button, Alert, Collapse } from "antd";
import { GoogleOutlined } from "@ant-design/icons"; // For Google logo
import { useNavigate, useLocation } from "react-router-dom";

// Context
import { useAuthContext } from "../../state/AuthContext";

// Hooks
import useAppUser from "../../hooks/backend-hooks/useAppUser";

// Styles
import styles from "./Auth.module.css";
import demoLogo from "../../assets/ap-logo-dmeo.png";

function SignIn() {
  const { login } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showManualSignIn, setShowManualSignIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Location state handling
  const from = location.state?.from?.pathname || "/";
  console.log("from", from);

  const { appUser } = useAppUser();

  // Temporary sollution for redirect issue. Make sure that authenticated users are not stuck on signin page.
  useEffect(() => {
    if (appUser) {
      navigate(from);
      console.log("Navigating to", from);
    }
  }, [appUser]);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("from", from);
      const amplifyUser = await signIn(username, password);
      const attributes = await fetchUserAttributes(amplifyUser);
      login({ ...amplifyUser, ...attributes });
    } catch (error) {
      console.error("Error signing in", error);
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
      navigate(from);
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
    console.log("Checking appUser for redirection:", appUser);
    if (appUser && appUser.userId) {
      console.log("Redirecting to", from);
      navigate(from);
    }
  }, [appUser, navigate, from]);

  return (
    <div className={styles.signInContainer}>
      <header className={styles.header}>
        <img src={demoLogo} alt="App Logo" className={styles.logo} />
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
      </div>
    </div>
  );
}

export default SignIn;
