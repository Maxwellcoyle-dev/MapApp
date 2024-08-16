import React, { useEffect } from "react";

import SignOutButton from "../components/Authentication/SignoutButton";

import useAppUser from "../hooks/backend-hooks/useAppUser";

const MyAccount = () => {
  const { appUser } = useAppUser();

  useEffect(() => {
    console.log(appUser);
  }, [appUser]);

  return (
    <div>
      <h1>My Account</h1>
      <SignOutButton />
    </div>
  );
};

export default MyAccount;
