import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/userApi";
import { fetchUserAttributes } from "aws-amplify/auth";

const useUser = (userData) => {
  console.log(userData);

  const [userAttributes, setUserAttributes] = useState({
    email: "",
    userId: userData.userId,
  });

  useEffect(() => {
    fetchUserAttributes()
      .then((user) => {
        console.log(user);
        setUserAttributes((prev) => ({
          ...prev,
          email: user.email,
        }));
      })
      .catch((error) => console.error(error));
  }, []);

  const {
    data: authUser,
    error: authUserError,
    isLoading: isAuthUserLoading,
  } = useQuery({
    queryKey: ["user", userAttributes],
    queryFn: () => getUser(userAttributes.userId, userAttributes.email),
    retry: false, // Do not retry if the user does not exist
    enabled: !!userAttributes.userId && !!userAttributes.email, // Only run the query if userId and email address are provided
    refetchOnMount: false, // Do not refetch on mount
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { authUser, authUserError, isAuthUserLoading };
};

export default useUser;
