import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/userApi";
import { fetchUserAttributes } from "aws-amplify/auth";

const fetchUser = async () => {
  const cognitoUser = await fetchUserAttributes();
  const appUser = await getUser(cognitoUser.sub, cognitoUser.email);
  return appUser;
};

const useAppUser = () => {
  const {
    data: appUser,
    error: appUserError,
    isLoading: isAppUserLoading,
  } = useQuery({
    queryKey: ["app-user"],
    queryFn: fetchUser,
    retry: false, // Do not retry if the user does not exist
    refetchOnMount: false, // Do not refetch on mount
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60, // 1 hour
  });

  return { appUser, appUserError, isAppUserLoading };
};

export default useAppUser;
