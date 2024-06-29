import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/userApi";
import { fetchUserAttributes } from "aws-amplify/auth";

const useUser = (userData) => {
  const [userAttributes, setUserAttributes] = useState({
    email: "",
    userId: userData.userId,
  });

  useEffect(() => {
    fetchUserAttributes()
      .then((user) => {
        console.log("User: ", user);
        setUserAttributes((prev) => ({
          ...prev,
          email: user.email,
        }));
      })
      .catch((error) => console.error(error));
  }, []);

  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user", userAttributes.userId, userAttributes.email],
    queryFn: () => getUser(userAttributes.userId, userAttributes.email),
    retry: false, // Do not retry if the user does not exist
    enabled: !!userData.userId, // Only run the query if userId is provided
  });

  return { user, userError, isUserLoading };
};

export default useUser;
