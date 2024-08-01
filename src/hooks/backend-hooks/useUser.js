import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/userApi";
import { fetchUserAttributes } from "aws-amplify/auth";

const useUser = () => {
  const [userAttributes, setUserAttributes] = useState({
    email: "",
    userId: "",
  });
  const [authError, setAuthError] = useState(""); // State to track authentication errors

  useEffect(() => {
    fetchUserAttributes()
      .then((user) => {
        console.log("User: ", user);
        setUserAttributes((prev) => ({
          userId: user.sub,
          email: user.email,
        }));
        setAuthError(""); // Clear any previous authentication errors
      })
      .catch((error) => {
        console.error(error);
        if (error === "NotAuthorizedException") {
          setAuthError(
            "Unauthenticated access is not supported. Please log in."
          );
        } else {
          setAuthError(
            "Failed to fetch user attributes. Please try again later."
          );
        }
      });
  }, []);

  const {
    data: authUser,
    error: authUserError,
    isLoading: isAuthUserLoading,
  } = useQuery({
    queryKey: ["user", userAttributes.userId],
    queryFn: () => getUser(userAttributes.userId, userAttributes.email),
    retry: false, // Do not retry if the user does not exist
    enabled: !!userAttributes.userId && !!userAttributes.email, // Only run the query if userId and email address are provided
    refetchOnMount: false, // Do not refetch on mount
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { authUser, authUserError, isAuthUserLoading, authError };
};

export default useUser;
