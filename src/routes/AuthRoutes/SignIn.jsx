import React, { useState, useEffect } from "react";
import { signIn, signInWithRedirect, fetchAuthSession } from "@aws-amplify/auth";
import { Form, Input, Button, Alert, Collapse } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../state/AuthContext";
import styles from "./Auth.module.css";
import demoLogo from "../../assets/ap-logo-dmeo.png";

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchAuthSession();
        navigate("/");
      } catch (error) {
        // User is not authenticated, stay on sign-in page
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignIn = async (values) => {
    setLoading(true);
    setError("");
    try {
      const { username, password } = values;
      const amplifyUser = await signIn(username, password);
      login(amplifyUser);
      navigate("/");
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
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input placeholder="Enter your username" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
              {error && <Alert message={error} type="error" showIcon />}
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
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
