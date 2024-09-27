import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuthContext } from "../state/AuthContext"; // Adjust path as needed
import { signOut } from "aws-amplify/auth";

const SignOutButton = () => {
  const { logout } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      logout();
    } catch (error) {
      console.error("Error signing out", error);
      // Optionally handle errors, e.g., show a message to the user
    }
  };

  return (
    <Button
      danger
      type="primary"
      icon={<LogoutOutlined />}
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
