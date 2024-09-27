import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, Typography, Card } from "antd";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { DeleteOutlined } from "@ant-design/icons";
import SignOutButton from "../components/SignoutButton";
import useDeleteUserAccount from "../hooks/backend-hooks/useDeleteUserAccount";
import useAppUser from "../hooks/backend-hooks/useAppUser";

const { Title, Text } = Typography;

const MyAccount = () => {
  const { appUser } = useAppUser();
  const navigate = useNavigate();
  const { deleteUserAccountAsync, deleteUserAccountIsPending } =
    useDeleteUserAccount();

  const handleDeleteUser = async () => {
    try {
      await deleteUserAccountAsync(appUser.data.userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => navigate("/")} icon={<MdKeyboardArrowLeft />}>
          Back
        </Button>
      </div>

      <Title level={2}>My Account</Title>

      <Card style={{ marginBottom: "20px" }}>
        <div>
          <Text strong>Email:</Text>
          <div style={{ marginTop: "8px" }}>
            <Text>{appUser?.data.email}</Text>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <SignOutButton />
        <Popconfirm
          title="Are you sure you want to delete your account?"
          onConfirm={handleDeleteUser}
          okText="Yes"
          cancelText="No"
          loading={deleteUserAccountIsPending}
          disabled={deleteUserAccountIsPending}
          description="This action cannot be undone."
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete Account
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default MyAccount;
