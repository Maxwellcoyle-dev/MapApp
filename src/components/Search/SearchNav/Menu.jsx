import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button } from "antd";
import {
  UserOutlined,
  TagsOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { signOut } from "aws-amplify/auth";
import { useAuthContext } from "../../../state/AuthContext";

const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const dropdownItems = [
    {
      key: "1",
      label: "Account",
      icon: <UserOutlined />,
      onClick: () => {
        navigate("/my-account");
      },
    },
    {
      key: "2",
      label: "Manage Categories",
      icon: <TagsOutlined />,
      onClick: () => {
        navigate("/manage-categories");
      },
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: async () => {
        await signOut();
        logout();
      },
    },
  ];

  return (
    <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Button icon={<MenuOutlined />} />
      </a>
    </Dropdown>
  );
};

export default Menu;
